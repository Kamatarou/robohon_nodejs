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

//どのタイミングで来たか識別する文字列
var device = "";

/**
 * 
 * 処理セクション
 * 
*/ 
exports.RTDBTester = async function(){
  Txt = "あああ";
  console.log("Text->"+ Txt);
  var testref = database.ref("test/").push();
  var key = testref.key;
  console.log("ref ->" + testref);
  console.log("key ->" + key);
  await testref.set({test: Txt , hoge:"foobar"} , function(err){
    if(err){
      console.error(err);
    }
    else{
      console.log("Success Send");
      console.log("send Data-> {test: Txt , hoge: 'foobar'}")
    }
  });
}

exports.RTDBSender = async function(Txt,name){
  //メッセージ本文の受け取りが出来てればスルー、出来てないなら強制終了
  if(Txt){  
    console.log("Text->"+ Txt);
  }
  else{
    console.warn("No Text");
    return
  }
  //識別名の受け取りが出来ていればスルー、出来てなかったり一致してない場合強制終了
  if(name){
    if(name === "Android"){
      device = "Android(Server)";
    }
    else if(name === "Bot"){
      device = "Bot";
    }
    else{
      console.warn("no mutch indentify");
      return
    }
    console.log(device);
  }
  else{
    console.warn("No name");
    return
  }

  //接続準備
  var ref = database.ref("chat/").push();
  var key = ref.key;
  /*console.log("ref ->" + ref);
  console.log("key ->" + key);*/
  var json = {device : device, 
  firebasekey : key,
  isSpeech : false,
  message : Txt 
  };

  //接続
  await ref.set(json , function(err){
    if(err){
      //接続失敗
      console.error(err);
    }
    else{
      //接続成功
      console.log("Success Send");
      //console.log("send Data-> " + json);
    }
  });
}

exports.RTDBSend_Sentiment = async function(Sentiment){
  //接続準備
  if(!Sentiment){
    return;
  }
  console.log(Sentiment);
  var ref = database.ref("sentiment/").push();
  console.log(ref)
  var key = ref.key;
  var RawTxt = Sentiment.text;
  var docScore = Sentiment.score;
  var docMag = Sentiment.magnitude;
  console.log(RawTxt);

  var json = {
    firebasekey : key,
    Text : RawTxt,
    Score : docScore,
    Magnitude : docMag
  };

  //接続
  await ref.set(json , function(err){
    if(err){
      //接続失敗
      console.error(err);
    }
    else{
      //接続成功
      console.log("Success Send");
      //console.log("send Data-> " + json);
    }
  });
}