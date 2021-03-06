//dialogflow周りのことをする関数群

/**
 * 
 * 宣言セクション
 * 
 */
const dialogflow = require('dialogflow');
const uuid = require('uuid');

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
          var err = {Result : "NG", Message:"Not get texts"};
          return err;
        }

        var EndFlg = false;
    
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

        console.log("await");
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        console.log("result->" + responses[0]);
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        console.log(`  action: ${result.action}`);
        console.log(`  Propaty: ${result.parameters}`);
        if(result.diagnosticInfo){
          console.log(`  End Dialog`);
          EndFlg = true;
        }
        if (result.intent) {
          console.log(`  Intent: ${result.intent.displayName}`);
          var json = {
            Result : "OK", 
            Response : result.fulfillmentText, 
            Intent : result.intent.displayName, 
            end_conversation : EndFlg,
            outputContexts : result.outputContexts,
            parameters : result.parameters,
          };
        } else {
          console.log(`  No intent matched.`);
          var json = {Result : "OK", Response : result.fulfillmentText, Intent : "No intent matched"};
        }
        return json;
    }

