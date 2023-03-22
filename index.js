// const AWS = require('aws-sdk');
const { Client } = require('@notionhq/client');
const { Configuration, OpenAIApi  } = require('openai');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generateBlogPosts = async (event, context) => {
  try {
    // Step 1: Generate 10 article titles and outlines
    const titlesAndOutlines = await generateTitlesAndOutlines();
    console.log(titlesAndOutlines);

    // Step 2: Add each title and outline as a new page in Notion database
    const databaseId = process.env.NOTION_DATABASE_ID;
    const createdPages = await Promise.all(
      titlesAndOutlines.map(async (titleAndOutline) => {
        const newPage = {
          properties: {
            Title: { title: [{ text: { content: titleAndOutline.title } }] },
            Outline: { rich_text: [{ text: { content: titleAndOutline.outline } }] },
            Status: { select: { name: '下書き' } },
          },
        };
        return notion.pages.create({ parent: { database_id: databaseId }, properties: newPage.properties });
      })
    );

    console.log(`${createdPages.length} pages created in Notion database`);

    // Step 3: Monitor for changes in status and generate blog post if status is confirmed
    const pageIds = createdPages.map((page) => page.id);
    await monitorStatusChanges(pageIds);
  } catch (error) {
    console.error(error);
  }
};

async function generateTitlesAndOutlines() {
  const prompt = 'ストリートダンスに関連する上位のおすすめ記事タイトルとアウトラインを5個生成してください。';
  const options = {
    temperature: 0.5,
    max_tokens: 60,
    n: 1,
    stop: ['\n'],
  };
  const result = await openai.createCompletion(prompt, options);
  console.log(result)
  const titlesAndOutlines = result.choices[0].text.trim().split('\n').map((titleAndOutline) => {
    const [title, outline] = titleAndOutline.split(':');
    return { title: title.trim(), outline: outline.trim() };
  });
  return titlesAndOutlines;
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

generateBlogPosts();
