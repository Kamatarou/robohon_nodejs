//Firebase RealtimeDatabse周りのことをする関数群
/**
 * 
 * 宣言セクション
 * 
 */
var admin = require('firebase-admin');
var serviceAccount = require("../confidential/vik/chat001-16c14-firebase-adminsdk-yzgox-e0940b30ea.json");

//firebaseの初期化やら認証やら
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat001-16c14.firebaseio.com"
});

var database = admin.database();

/**
 * 
 * 処理セクション
 * 
*/ 
exports.RTDBTester = async function(){
  Txt = "あああ";
  console.log("Text->"+ Txt);
  var testref = database.ref("test/");
  console.log("ref ->" + testref);
  await testref.push().set({test: Txt , hoge:"foobar"} , function(err){
    if(err){
      console.error(err);
      return "{Result : 'NG' , Stats : 500}";
    }
    else{
      console.log("Success Send");
      return "OK";
    }
  });
  
}

exports.RTDBSender = function(Txt){}