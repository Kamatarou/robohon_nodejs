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
  databaseURL: "https://chat001-16c14.firebaseio.com",
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
      device = "Android";
    }
    else if(name === "Bot"){
      device = "ロボホン";
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
      console.log("Success Send *Normal*");
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
  var timestamp = moment().unix();
  console.log("time ->"+time);
  console.log("RawTxt->"+RawTxt);

  var json = {
    firebasekey : key,
    Text : RawTxt,
    Score : docScore,
    Magnitude : docMag,
    time : time,
    timestamp : timestamp
  };

  //接続
  await ref.set(json , function(err){
    if(err){
      //接続失敗
      console.error(err);
    }
    else{
      //接続成功
      console.log("Success Send *Sentiment*");
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
  var phrase = "";
  var ref = database.ref("dfLog/" + fkey + "/");
  var key = ref.key;
  var text = params.Response;
  var intent = params.Intent;
  var outputContexts = params.outputContexts;
  //取得
  console.log("******************************");
  console.log("text->"+text);
  console.log("Intent->" + intent);
  console.log("outputContexts->");
  Object.keys(outputContexts).forEach(function(key){
    console.log("key-->", key);
    var field = outputContexts[key].parameters.fields;
    if(field){
      Object.keys(field).forEach(function(key){
        if(key.indexOf(".original") == -1){
          console.log(key," : ",field[key]);
           if(field[key].stringValue){
            phrase += field[key].stringValue;
            phrase += ",";
          }
          if(field[key].numberValue){
            phrase += field[key].numberValue;
            phrase += ",";
          }
        }
      });
    }
  });
  //末尾一文字削除して整形
  phrase = phrase.slice(0,-1);
  console.log("All Phrase->" + phrase);
  var name = "";
  var dpName = intent;

  //データセット
  var json = {
    firebasekey : key,
    Phrase : phrase,
    name : name,
    displayname : dpName
  };

  //接続
  await ref.set(json , function(err){
    if(err){
      //接続失敗
      console.error(err);
    }
    else{
      //接続成功
      console.log("Success Send *Params*");
      //console.log("send Data-> " + json);
    }
  });
}

exports.RTDBSend_Fallback = async function(Intent){
  
}

exports.RTDBGetter = async function(Colect,Mail){
  console.log("RTFB Getter is Now Working");
  var ref = database.ref("dfLog/");
  var mailref = database.ref("minus/");

  //dfLogの監視
  ref.on("child_added", function(snapshot){
    var post = snapshot.val();
    //console.log(post);
    //Colect.datapic();
    /*Object.keys(post).forEach(function(key){
        //console.log(key);
    });*/
  },function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  //minusの監視
  mailref.on("child_added",function(snapshot) {
    //Mail.mail();
  },function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
} 

/*async function GetterTest(){
  console.log("Getter test is Now Working");
  var ref = database.ref("dfLog/");
  ref.on("value", function(snapshot){
    var post = snapshot.val();
    console.log(post);
    Object.keys(post).forEach(function(key){
        console.log(key);
    });
  },function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}
GetterTest();
*/