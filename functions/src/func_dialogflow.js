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
exports.get_Intent = async function(Txt){
        // 接続部分
        const sessionClient = new dialogflow.SessionsClient();
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);
        if(Txt){
          console.log("text->" + Txt);
        }
        else{
          var err = {Result : "NG", Message:"Don't Get Texts"};
          return err;
        }
    
        //取得
        const request = {
            session: sessionPath,
            queryInput: {
              text: {
                text: Txt,
                languageCode: 'ja',
              },
            },
          };

        console.log("await")
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        console.log("result->" + responses[0]);
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        console.log(`  action: ${result.action}`);
        console.log(`  Propaty: ${result.parameters}`);
        console.log(`  End Dialog ${result.diagnosticInfo.fields}`);
        JSON.parse(JSON.stringify(result.diagnosticInfo.fields.end_conversation),function(key,value){
          console.log("     "+key +" : " + value);
          if(!key){
            JSON.parse(JSON.stringify(value),function(k,v){
              console.log("     *"+k +" : " + v);
            });
          }
        });
        if (result.intent) {
          console.log(`  Intent: ${result.intent.displayName}`);
          var json = {Result : "OK", Response : result.fulfillmentText, Intent : result.intent.displayName};
        } else {
          console.log(`  No intent matched.`);
          var json = {Result : "OK", Response : result.fulfillmentText, Intent : "No intent matched"};
        }
        return json;
    }

