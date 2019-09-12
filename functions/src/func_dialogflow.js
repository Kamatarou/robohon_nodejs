//dialogflow周りのことをする関数群

/**
 * 
 * 宣言セクション
 * 
 */
//
const dialogflow = require('dialogflow');

//dialogflowのRESTAPI
const URI_DF = "";
var json_result ={};


/**
 * 
 * 処理セクション
 * 
*/


module.exports = class DialoglowAPI {
    constructor(){
        // Dialogflowの接続情報を設定
        let client_option = {
            project_id: "chat001-16c14", // DialogflowのProject ID
        }
        client_option.credentials = {
            client_email: client_email // DialogflowのService Account
            private_key: private_key // GCPで生成したprivate key
        }

        this.sessionClient = new dialogflow.SessionsClient(client_option);
        this.sessionPath = this.sessionClient.sessionPath(prject_id, project_id);
    }
}