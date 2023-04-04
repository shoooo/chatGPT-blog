const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const { removeNumberedPrefixes } = require("../config/truncate");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const model = 'gpt-3.5-turbo';

// Step 1: Generate 10 article titles
async function generateBlogTopics() {
    const prompt = "トレンドや話題、製品レビューや比較記事、リスト型記事、オピニオンや議論、チュートリアルやハウツー記事。それぞれの項目でストリートダンス関連のおすすめのタイトルを1つずつ教えて";
    const response = await openai.createChatCompletion({
        model: model,
        messages: [{ role: "assistant", content: prompt }],
        n: 1,
        stop: null,
        temperature: 1,
    });

    const inputText = response.data.choices[0].message.content.split('\n').filter(t => t.trim() !== '');
    // console.log(inputText);
    // const topics = removeNumberedPrefixes(inputText)
    return inputText
}

async function writeBlogPost(topic) {
    // add tag and create thumbnail using unsplash?? how do i let the system choose the right image
    const prompt = `#命令書：
    あなたはプロのブログライターです。以下の制約条件から最高のブログを出力してください。`;

    const rule = `#制約条件：
    - 2000文字程度で書いて
    - 小学生にもわかりやすく書いて
    - フレンドリーな文体で書いて
    - 「ー」などを活用した崩した文体で書いて
    - Notionの記述方法で
    - 見出しを付けて書いて
    - 目次を付けて`

    const input = `#タイトル：${topic}`;

    const response = await openai.createChatCompletion({
        model: model,
        messages: [
            { role: "system", content: prompt },
            { role: "system", content: rule },
            { role: "system", content: input },
    ],
        // max_tokens: 200,
        temperature: 0.8,
        n: 1,
        stop: null,
        temperature: 0.8,
    });

    const post = response.data.choices[0].message.content;
    return post;
}

async function createInstagramPost() {
    // Generate caption and hashtags
    const prompt = "Generate a caption and hashtags for an Instagram post about technology.";
    const response = await openai.complete({
        engine: model,
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

module.exports = { generateBlogTopics, writeBlogPost, createInstagramPost }