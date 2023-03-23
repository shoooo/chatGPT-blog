const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const model = 'gpt-3.5-turbo';

// Step 1: Generate 10 article titles
async function generateBlogTopics() {
    const prompt = "トレンドや話題、製品レビューや比較記事、リスト型記事、オピニオンや議論、チュートリアルやハウツー記事。それぞれの項目でストリートダンス関連のおすすめのタイトルを1つずつ教えて";
    const response = await openai.createChatCompletion ({
        model: model,
        messages: [{role: "assistant", content: prompt}],
        // max_tokens: 200,
        n: 1,
        stop: null,
        temperature: 1,
    });

    const topics = response.data.choices[0].message.content.split('\n').filter(t => t.trim() !== '');
    return topics;
}

async function writeBlogPost(topic) {
    // add tag and create thumbnail using unsplash?? how do i let the system choose the right image
    const prompt = `#命令書
    あなたはプロのブログライターです。以下の制約条件とタイトルから最高ブログ記事を出力してください。
    
    #制限条件：
    - 事実に基づいて
    - 文字数は3000文字程度
    - 小学生にもわかりやすくフレンドリーな文体
    - 「ー」などを活用した崩した文体
    - Notionの記述方法、目次の追加
    
    #タイトル：${topic}`;

    const response = await openai.createChatCompletion ({
        model: model,
        messages: [{role: "assistant", content: prompt}],
        // max_tokens: 200,
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

module.exports = {generateBlogTopics, writeBlogPost, createInstagramPost}