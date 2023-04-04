const { generateBlogTopics, writeBlogPost } = require("./api/gpt");
const { insertTopicsIntoNotionDatabase, monitorStatusChanges, insertBlogPostIntoPage } = require("./api/notion");
const { getThumbnailPhoto } = require("./api/unsplash");

exports.handler = async (event) => {
  try {
    // Step 1: Generate 5 article titles
    const topics = await generateBlogTopics();
    // Step 2: Add each title as a new page in Notion database
    insertTopicsIntoNotionDatabase(topics)

    // Step 3: Monitor for changes in status and generate blog post if status is confirmed
    const confirmedPages = await monitorStatusChanges();
    const pages = confirmedPages.results

    for (const page of pages) {
      const title = page.properties.タイトル.title[0].plain_text;
      const page_id = page.id
      const post = await writeBlogPost(title)

      // Step 5: Update page status to "Writing" and add blog post to page
      await insertBlogPostIntoPage(page_id, post);
    }

    // Step 5: Once again, monitor for changes in status and generate instagram post if status is confirmed
    // Using title and outline/description?, generate image (text and unsplash) and caption, then schedule on buffer
  } catch (error) {
    console.error(error);
  }
};

// itll be on lambda at the end which gets called once every day
// possible issues: posts not high quality -> improve prompt, needs fact check -> use another GPT or I check by myself,
