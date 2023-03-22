const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

async function insertPostIntoNotionDatabase(title, content, thumbnailUrl) {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const newPage = {
      Title: { title: [{ type: "text", text: { content: title } }] },
      Content: { rich_text: [{ type: "text", text: { content: content } }] },
      Thumbnail: { url: thumbnailUrl },
    };

    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: newPage,
    });
  }

  async function monitorStatusChanges(pageIds) {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const pages = await notion.pages.retrieve({ page_id: pageIds, properties: ['Status'] });
    const confirmedPages = pages.filter((page) => page.properties.Status.select.name === '確認済み');

    for (const page of confirmedPages) {
      const { Title, Outline } = page.properties;
      const prompt = `以下は${Title.title[0].text.content}に関するブログ記事です。\n${Outline.rich_text[0].text.content}`;
      const options = {
        temperature: 0.7,
        max_tokens: 2048,
        n: 1,
        stop: ['。'],
      };
      const result = await openai.complete(prompt, options);
      const blogPost = result.choices[0].text.trim();
      console.log(`Blog post generated for ${Title.title[0].text.content}`);

      // Update page status to "Published" and add blog post to page properties
      const properties = {
        Status: { select: { name: '公開済み' } },
        'ブログ記事': { rich_text: [{ text: { content: blogPost } }] },
      };
      await notion.pages.update({ page_id: page.id, properties: properties });
    }
  }