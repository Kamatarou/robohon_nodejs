//Cloud Natural Language周りのことをする関数群
/**
 * 
 * 宣言セクション
 * 
 */
// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Instantiates a client
const client = new language.LanguageServiceClient();


/**
 * 
 * 処理セクション
 * 
*/ 
async function quickstart() {
  // The text to analyze
  const text = 'こんにちは！今日はとてもいい天気です!!!3日ぶりです!!!';

  const document = {
    content: text,
    type: 'PLAIN_TEXT',
    language : "ja"
  };

  // Detects the sentiment of the text
  const [result] = await client.analyzeSentiment({document: document});
  const sentiment = result.documentSentiment;

  console.log(`Text: ${text}`);
  console.log(`Sentiment score: ${sentiment.score}`);
  console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  console.log(result.language);
  console.log(result);
}

quickstart();