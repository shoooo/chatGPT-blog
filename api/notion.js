const { Client } = require('@notionhq/client');
require('dotenv').config();
const { getThumbnailPhoto } = require("../api/unsplash");

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
  console.log(`${confirmedPages.results.length} confirmed pages found in Notion database`);

  return confirmedPages
}

const insertBlogPostIntoPage = async (page_id, post) => {
  await notion.blocks.children.append({
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

  const keyword = 'dance'
  const num = Math.floor(Math.random() * 5000) + 1;
  const thumbnailURL = `https://source.unsplash.com/random/?${keyword}&${num}`;

  const properties = {
    ステータス: { status: { name: 'Writing' } },
  };

  const cover = {
    "type": "external",
    "external": {
      "url": thumbnailURL,
    }
  };

  await notion.pages.update({ page_id: page_id, properties: properties, cover: cover });
}

module.exports = { insertTopicsIntoNotionDatabase, monitorStatusChanges, insertBlogPostIntoPage }