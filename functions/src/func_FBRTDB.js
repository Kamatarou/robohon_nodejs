//Firebase RealtimeDatabse周りのことをする関数群
/**
 * 
 * 宣言セクション
 * 
 */
var admin = require('firebase-admin');
var serviceAccount = require("../confidential/vik/chat001-16c14-firebase-adminsdk-yzgox-e0940b30ea.json");
var moment = require('moment');
require('moment-timezone');

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


  var fkey;
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
      fkey = json.firebasekey
      //console.log("send Data-> " + json);
    }
  });
  return fkey;
}

exports.RTDBSend_Sentiment = async function(Sentiment,fkey){
  //接続準備
  if(!Sentiment){
    return;
  }
  console.log("ResultSentiment->" + Sentiment.Result);
  var ref = database.ref("sentiment/" + fkey + "/");
  var key = ref.key;
  var RawTxt = Sentiment.Text;
  var docScore = Sentiment.score;
  var docMag = Sentiment.magnitude;
  var time = moment().tz("Asia/Tokyo").format("YYYY/MM/DD,HH:mm:ss");
  console.log("time ->"+time);
  console.log("RawTxt->"+RawTxt);

  var json = {
    firebasekey : key,
    Text : RawTxt,
    Score : docScore,
    Magnitude : docMag,
    time : time
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

exports.RTDBSend_Params = async function(params,fkey){
  if(!params){
    return;
  }
  if(!params.end_conversation){
    //会話が終わってない場合
    console.log("No End to conversation");
    return;
  }

  var ref = database.ref("dfLog/" + fkey + "/");
  var key = ref.key;
  /**
   * Result : "OK", 
     Response : result.fulfillmentText, 
     Intent : result.intent.displayName, 
     end_conversation : EndFlg,
     Propaty : result.Propaty,
     outputContexts : result.outputContexts
   */
  var text = params.Response;
  var propaty = params.Propaty;
  var outputContexts = params.outputContexts;
  console.log("******************************");
  console.log("text->"+text);
  console.log("propary->");
  JSON.parse(JSON.stringify(propaty) , function(key, value){
    console.log(key +" : " + value);
  });
  console.log("outputContexts->");
  JSON.parse(JSON.stringify(outputContexts) , function(key, value){
    console.log(key +" : " + value);
  });


}

exports.RTDBSend_Fallback = async function(Intent){
  
}

exports.RTDBGetter = async function(){
  console.log("RTFB Getter is Now Working");
  var ref = database.ref("sentiment/");
  ref.on("child_added",function(snapshot, prevChildKey){
    var post = snapshot.val();
    console.log("post" + post);
    console.log("prev" + prevChildKey);
  });
}