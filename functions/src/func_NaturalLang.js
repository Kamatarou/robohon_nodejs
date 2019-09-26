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
exports.get_Sentiment = async function(Text) {
  // 分析したい文字を代入
  const text = "こんにちは！今日はとてもいい天気です!!!3日ぶりです!!!";
  if(Text){
    const text = Text;
  }
      

  const document = {
    content: text,
    type: 'PLAIN_TEXT',
    language : "ja"
  };

  // 文字から感情を検出する
  const [result] = await client.analyzeSentiment({document: document});
  const docsentiment = result.documentSentiment;

  //いろいろ表示
  console.log(`Text: ${text}`);
  console.log(`Sentiment score: ${docsentiment.score}`);
  console.log(`Sentiment magnitude: ${docsentiment.magnitude}`);
  console.log(result.language);
  console.log("--------------");
  console.log(result.sentences);
  return result;
}