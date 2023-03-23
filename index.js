const { generateBlogTopics, writeBlogPost } = require("./config/gpt");
const { insertTopicsIntoNotionDatabase, monitorStatusChanges, insertBlogPostIntoPage } = require("./config/notion");

const generateBlogPosts = async (event, context) => {
  try {
    // Step 1: Generate 5 article titles
    // better trimming needed
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
      console.log(post);

      // Step 4: Update page status to "Published" and add blog post to page
      // need to get block id for this
      // await insertBlogPostIntoPage(page_id, post);
    }

    // Step 5: Once again, monitor for changes in status and generate instagram post if status is confirmed
    // Using title and outline/description?, generate image (text and unsplash) and caption, then schedule on buffer


  } catch (error) {
    console.error(error);
  }
};

generateBlogPosts();
