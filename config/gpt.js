const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Step 1: Generate 10 article titles
async function generateBlogTopics() {
    const prompt = "ストリートダンスに関連する上位のおすすめ記事タイトルを10個生成してください。";
    const response = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: prompt,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 0.8,
    });

    const topics = response.choices[0].text.split('\n').filter(t => t.trim() !== '');
    return topics;
}

async function selectTop2SEOTopics(topics) {
    // Perform keyword analysis using an SEO library or API
    // For demonstration purposes, we're using a dummy ranking
    const rankedTopics = topics.map((topic, index) => ({ topic, rank: Math.random() }));
    rankedTopics.sort((a, b) => b.rank - a.rank);

    return rankedTopics.slice(0, 2).map(rankedTopic => rankedTopic.topic);
}

async function writeBlogPost(topic) {
    const prompt = `Write a short blog post about the following topic: ${topic}`;
    const response = await openai.complete({
        engine: "text-davinci-002",
        prompt: prompt,
        max_tokens: 200,
        n: 1,
        stop: null,
        temperature: 0.8,
    });

    return response.choices[0].text;
}

async function createInstagramPost() {
    // Generate caption and hashtags
    const prompt = "Generate a caption and hashtags for an Instagram post about technology.";
    const response = await openai.complete({
      engine: "text-davinci-002",
      prompt: prompt,
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.8,
    });

    const caption = response.choices[0].text;

    // Fetch related image from Unsplash API
    const imageUrl = await fetchRelatedImage();

    // Placeholder text for the image
    const text = "Technology";

    return { imageUrl, text, caption };
  }

module.exports = {generateBlogTopics}