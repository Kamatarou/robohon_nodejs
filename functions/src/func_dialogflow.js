//dialogflow周りのことをする関数群

/**
 * 
 * 宣言セクション
 * 
 */
const dialogflow = require('dialogflow');
const uuid = require('uuid');

//結果受け取る変数
var result;
//DialogflowのProjectID
const projectId = 'chat001-16c14';
//他とかぶりのない一意なセッションID
const sessionId = uuid.v4();

/**
 * 
 * 処理セクション
 * 
*/ 

exports.get_Intent = async function(){


        // 接続部分
        const sessionClient = new dialogflow.SessionsClient();
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);
        
        //取得
        const request = {
            session: sessionPath,
            queryInput: {
              text: {
                text: 'こんにちは',
                languageCode: 'ja',
              },
            },
          };

        
        console.log("await");
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        console.log("result->" + responses[0]);
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
          console.log(`  Intent: ${result.intent.displayName}`);
        } else {
          console.log(`  No intent matched.`);
        }
        return responses[0];
    }
