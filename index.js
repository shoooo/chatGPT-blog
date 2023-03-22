// const AWS = require('aws-sdk');
const { Client } = require('@notionhq/client');
const { Configuration, OpenAIApi  } = require('openai');
require('dotenv').config();
const { generateBlogTopics } = require("./config/gpt");

// const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

const generateBlogPosts = async (event, context) => {
  try {
    // Step 1: Generate 10 article titles and outlines
    // const topics = await generateBlogTopics();
    // console.log(topics);

    // // Step 2: Add each title and outline as a new page in Notion database
    // const databaseId = process.env.NOTION_DATABASE_ID;
    // const createdPages = await Promise.all(
    //   titlesAndOutlines.map(async (titleAndOutline) => {
    //     const newPage = {
    //       properties: {
    //         Title: { title: [{ text: { content: titleAndOutline.title } }] },
    //         Outline: { rich_text: [{ text: { content: titleAndOutline.outline } }] },
    //         Status: { select: { name: '下書き' } },
    //       },
    //     };
    //     return notion.pages.create({ parent: { database_id: databaseId }, properties: newPage.properties });
    //   })
    // );

    // console.log(`${createdPages.length} pages created in Notion database`);

    // // Step 3: Monitor for changes in status and generate blog post if status is confirmed
    // const pageIds = createdPages.map((page) => page.id);
    // await monitorStatusChanges(pageIds);
  } catch (error) {
    console.error(error);
  }
};

generateBlogPosts();
