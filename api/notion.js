const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

async function insertTopicsIntoNotionDatabase(topics) {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const createdPages = await Promise.all(
    topics.map(async (title) => {
      console.log(title)
      const newPage = {
        properties: {
          タイトル: { title: [{ text: { content: title } }] },
          ステータス: { status: { name: 'Not started' } },
        },
      };

      return notion.pages.create({ parent: { type: "database_id", database_id: databaseId }, properties: newPage.properties });
    })
  );

  console.log(`${createdPages.length} pages created in Notion database`);
}

async function monitorStatusChanges() {
  const databaseId = process.env.NOTION_DATABASE_ID;

  const confirmedPages = await notion.databases.query({
    database_id: databaseId,
    "filter": {
      "property": "ステータス",
      "status": {
        "equals": "Topic checked"
      }
    }
  });

  return confirmedPages
}

const insertBlogPostIntoPage = async (page_id, post) => {
  const response = await notion.blocks.children.append({
    block_id: page_id,
    children: [{
        "paragraph": {
          "rich_text": [
            {
              "text": {
                "content": post
              }
            }
          ]
        }
      }]
  });
  console.log(response);

  const properties = {
    ステータス: { status: { name: 'Writing' } },
    サムネイル: { file: { url: thumbnailURL } },
  };

  await notion.pages.update({ page_id: page_id, properties: properties });
}

module.exports = { insertTopicsIntoNotionDatabase, monitorStatusChanges, insertBlogPostIntoPage }