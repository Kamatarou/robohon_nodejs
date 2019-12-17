//Firebase RealtimeDatabse周りのことをする関数群
/**
 * 
 * 宣言セクション
 * 
 */
var admin = require('firebase-admin');
var serviceAccount = require("../confidential/vik/chat001-16c14-firebase-adminsdk-yzgox-e0940b30ea.json");
var moment = require('moment');
const cron = require('node-cron');
require('moment-timezone');
var mail_rtdb;

//firebaseの初期化やら認証やら
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat001-16c14.firebaseio.com",
});

const app2 = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat001-16c14-a23ae.firebaseio.com"
},"app2");

var database = admin.database(app);

var db2 = admin.database(app2);

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
  var time = moment().tz("Asia/Tokyo").format("YYYY-MM-DD,HH:mm:ss");
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

exports.RTDBSend_Params = async function(params,fkey,face){
  if(!params){
    return;
  }
  if(!face){
    var Face = "0";
  }
  else{
    var Face = face;
  }
  let cntref = db2.ref("00000000/stats/count/");
  var g_count;
  if(!(params.Intent.indexOf("Default Fallback Intent") > -1)){
    await cntref.once("value",async function(snapshot){
      g_count = snapshot.val();
      await cntref.set(++g_count);
    },function (err) {
      console.warn("count get error");
      console.warn(err);
      return
    });
  }
  
  let pary = [];
  Object.keys(params.parameters.fields).forEach(function(key){
    console.log("KEY:" + key);
    let field = params.parameters.fields[key];
    Object.keys(field).forEach(function(key){
      console.log("key->" + key + " : value-> " + field[key]);
      if(field[key] && !(key.indexOf("kind") > -1)){
        if((key === "replyYes" || key === "replyNo") && !field[key]){
          console.log("empty");
          if(key === "replyYes"){
            pary.push("肯定");
          }
          if(key === "replyNo"){
            pary.push("否定");
          }
        }
        pary.push(field[key]);
      }
    });
  });

  console.log("Intent ->" + params.Intent);
  let Intent = "";
  if(params.Intent.indexOf("morning") > -1){
    Intent = "morning";
  }
  else if(params.Intent.indexOf("good_night") > -1){
    Intent = "atnight";
  }
  else if(params.Intent.indexOf("Welcome_back") > -1){
    Intent = "welcomeback"
  }
  else{
    console.log("no match intent");
    await cntref.set(0);
    return;
  }

  if(!pary){
    pary.push("none");
  }
  let RootRobo = "00000000";
  console.log("RootRobo(AndroidID) ->" + RootRobo);
  console.log("Face ->" + Face);
  console.log("Intent ->"+ Intent);
  console.log("Now..." + "param"+ g_count);
  console.log("pary->" + pary[0]);

  let pnum = "param" + g_count;
  let time = moment().tz("Asia/Tokyo").format("MM-DD,HH:mm");

  let ref = db2.ref(RootRobo + "/" + Intent +"/" + "NowInfo/");
  let json ={
    [pnum]: pary[0],
    time : time
  };
    
  ref.update(json, function(err){
    if(err){
      console.warn(err);
    }
    else{
      console.log("success send *Params*");
    }
  });

  if(params.end_conversation){
    //会話が終わっている場合
    await cntref.set(0);

    var phrase = "";
    var ref_dfLog = database.ref("dfLog/" + fkey + "/");
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
    var json_dfLog = {
      firebasekey : key,
      Phrase : phrase,
      name : name,
      displayname : dpName
    };

    //接続
    await ref_dfLog.set(json_dfLog , function(err){
      if(err){
        //接続失敗
        console.error(err);
      }
      else{
        //接続成功
        console.log("Success Send *End_conv*");
        //console.log("send Data-> " + json);
      }
    });
    
  }

  return;
}

exports.RTDBSend_Fallback = async function(Intent){
  
}

exports.RTDBGetter = async function(){
  console.log("RTFB Getter is Now Working");
  var ref = database.ref("dfLog/");
  var mailref = database.ref("minus/");
  let cntref = db2.ref("00000000/stats/count/");
  let noticeref = database.ref("chat/");
  setTimeout(() => {
    //サーバー起動直後のファイアーストーム対策
    mail_rtdb = require('./mail_s.js');
    console.log("mail function is available");
  }, 1000 * 20);


  //dfLogの監視
  ref.on("child_added", function(snapshot){
    //var post = snapshot.val();
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

  //DB2のcount監視
  cntref.on("value", async function(snapshot){
    //console.log(snapshot.val());
    let timestamp = moment().unix();
    let ref = db2.ref("00000000/stats/");
    //let time = moment(timestamp * 1000).tz("Asia/Tokyo").format("MM-DD,HH:mm");
    //console.log("time unix" + time);
    await console.log("count ->" + snapshot.val());
    if(snapshot.val() == 0){
      console.log("no functions");
    }
    else{
      setTimeout(()=>{
        console.log("reset count");
        ref.update({count : 0});
      },1000 * 60 * 10);
      console.log("set timestamp");
      await ref.update({timestamp:timestamp});
    }
  },function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  
  //会話状態の監視
  noticeref.on("child_added", async function(snapshot){
    await console.log("Get Value ->" + snapshot.val());
    let refconv = database.ref("stats/isConv/");
    let isConv;
    let refstats = database.ref('stats/mailAddress/');
    let mailAddress;
    let subject = "ヘルパーロボホンからのお知らせ";
    let maintext = "ロボホンが会話を始めています\n確認する場合は下記のURLからアクセスしてください\n\n https://chat001-16c14.firebaseapp.com/D_chatrobo.html";
    //状態の変更
    await refconv.once("value" , async function(sp){
      isConv = sp.val();
      console.log("isConv ->" + isConv);
      //メールアドレスの取得
      await refstats.once("value" , async function(sp){
        mailAddress = sp.val();
        //console.log("mail : "+ mailAddress);
      });
      if(mail_rtdb){
        if(!isConv){
          if(mailAddress){
            //メールアドレスを取得できた場合
            //最初の会話が始まったらメールで通知
            await mail_rtdb.send(mailAddress,subject,maintext);
            //フラグを変更し、タイマー処理をセット
            await refconv.set(true);
            console.log("it's Trueth conversation");
            setTimeout(()=>{
              //フラグを戻す処理
              refconv.set(false);
              console.log("No Activity the conversation");
            },1000 * 60 * 10);
          }
          else{
            //メールアドレスを取得出来ない場合
            console.warn("Can't get mailAddress");
          }
        }
        else{
          console.log("already conversation");
        }
      }
    });
    
  },function(errorObject){
    console.log("The read failed: " + errorObject.code);
  });
} 

exports.RTDBCleanup = async function(){
  console.log("cleanup");
  let ref_senti = database.ref("sentiment/");
  let ref_dfLog = database.ref("dfLog/");
  let ref_chat = database.ref("chat/");
  let ref_minus = database.ref("minus/");
  let ref_sleeptime = database.ref("sleeptime/");

  cron.schedule('0 0 0 * * *', async function(){
    let time = moment().tz("Asia/Tokyo").format("YYYY/MM/DD,HH:mm:ss");
    console.log("Execution :"+ time);

    await ref_senti.once("value", async function(data){
      //要素数の取得
      let length = await data.numChildren();
      //要素が100超えていたら実行
      if(length > 100){
        let rem_num = length - 100;
        //let rem_num = 2;
        console.log("semtiment remove number :" + rem_num);
        try{
          //古いデータを指定
          let ref_rmv = ref_senti.limitToFirst(rem_num);
          let keys;
          //古いデータの取得
          await ref_rmv.once("value", async function(data){
            keys = await data.val();
          });
         //古いデータを削除
          Object.keys(keys).forEach(async function(key){
            await ref_senti.child(key).remove();
          });
        }
        catch(e){
          console.warn("Exception :" +e);
        }
      }
    });

    ref_dfLog.once("value", async function(data){
      let length = await data.numChildren();
      if(length > 100){
        //let rem_num = length - 100;
        let rem_num = 1;
        console.log("dfLog remove number :" + rem_num);
        try{
          let ref_rmv = ref_dfLog.limitToFirst(rem_num);
          let keys;
          await ref_rmv.once("value", async function(data){
            keys = await data.val();
          });
          Object.keys(keys).forEach(async function(key){
            await ref_dfLog.child(key).remove();
          });
        }
        catch(e){
          console.warn("Exception :" +e);
        }
      }
    });

    ref_chat.once("value", async function(data){
      let length = await data.numChildren();
      if(length > 100){
        //let rem_num = length - 100;
        let rem_num = 1;
        console.log("chat remove number :" + rem_num);
        try{
          let ref_rmv = ref_chat.limitToFirst(rem_num);
          let keys;
          await ref_rmv.once("value", async function(data){
            keys = await data.val();
          });
          Object.keys(keys).forEach(async function(key){
            await ref_chat.child(key).remove();
          });
        }
        catch(e){
          console.warn("Exception :" +e);
        }
      }
    });

    ref_minus.once("value", async function(data){
      let length = await data.numChildren();
      if(length > 100){
        //let rem_num = length - 100;
        let rem_num = 1;
        console.log("minus remove number :" + rem_num);
        try{
          let ref_rmv = ref_minus.limitToFirst(rem_num);
          let keys;
          await ref_rmv.once("value", async function(data){
            keys = await data.val();
          });
          Object.keys(keys).forEach(async function(key){
            await ref_minus.child(key).remove();
          });
        }
        catch(e){
          console.warn("Exception :" +e);
        }
      }
    });

    ref_sleeptime.once("value", async function(data){
      let length = await data.numChildren();
      if(length > 100){
        //let rem_num = length - 100;
        let rem_num = 1;
        console.log("minus remove number :" + rem_num);
        try{
          let ref_rmv = ref_sleeptime.limitToFirst(rem_num);
          let keys;
          await ref_rmv.once("value", async function(data){
            keys = await data.val();
          });
          Object.keys(keys).forEach(async function(key){
            await ref_sleeptime.child(key).remove();
          });
        }
        catch(e){
          console.warn("Exception :" +e);
        }
      }
    });
    
  });
}

async function IntentSeparator(intent){
  if(!intent){ return }

}