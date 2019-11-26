var admin = require('firebase-admin');
var mail = require('./mail_s.js');
var serviceAccount = require("../confidential/vik/chat001-16c14-firebase-adminsdk-yzgox-e0940b30ea.json");

const app3 = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chat001-16c14.firebaseio.com'
},"appmail");

var moment = require('moment');
require('moment-timezone');

var db = admin.database(app3);
var refmsg = db.ref('msgboard');
var refsent = db.ref('sentiment');
var refstats = db.ref('stats');
var refmin = db.ref('minus');
var startTime;
var score;
var stext;
var stime;


function negserch(){
   refsent.child('config').once('child_added',function(data){
    startTime = data.val();
    console.log("startTime->"+startTime);
  });

   refsent.on('child_added',function(data){
    stimestamp = data.val().timestamp;
    //console.log("timestamp->"+stimestamp);
    if(stimestamp>startTime){
      console.log("on hantei");
      score = data.val().Score;
      stext = data.val().Text;
      stime = data.val().time;
      sdtime = moment(stime, "MM/DD HH:mm");
      console.log("score->"+score);
      console.log("stext->"+stext);
      console.log("stime->"+sdtime);
      if(score<-0.7){
        setMinusData(score,stext,stime);
        subject = "ヘルパーロボホンからの警告";
        text = "気分が落ち込んでいる可能性があります。\n様子を見てあげましょう。\n\n発言内容：" + stext + "\n発言日時：" + sdtime;
        console.log("mailtext->" + text);
        mailer(subject,text);
      }
      else if(score<-0.4){
        setMinusData(score,stext,stime);
        subject = "ヘルパーロボホンからの警告";
        text = "少し調子がよくないかもしれません。\n\n発言内容：" + stext + "\n発言日時：" + sdtime;
        console.log("mailtext->" + text);
        mailer(subject,text);
      }
      else if(score<0){
        setMinusData(score,stext,stime);
      }
      setConfTime(stimestamp);
    }

  });
}

function msg_sayjudg(){
  refmsg.on('value',function(data){
    listenflg = data.val().isListen;
    message = data.val().message;
    name = data.val().name;
    time = data.val().time;
    console.log("test1->" + listenflg);
    console.log("message->" + message);
    console.log("name->" + name);
    console.log("time->" + time);
    listentime = moment().tz("Asia/Tokyo").format("MM/DD HH:mm");
    subject = "ヘルパーロボホンからのお知らせ";
    text = "ロボホンが伝言を伝えました！\n\n時間：" + listentime + "\n伝言内容：" + message;
    console.log("listentime->" + listentime);
    console.log("subject->" + subject);
    console.log("mailtext->\n" + text);
    if(listenflg){
      mailer(subject,text);
    }
  });
}

function mailer(subject,text){

  refstats.once('value',function(data){
            mailAddress = data.child('mailAddress').val();
            console.log(mailAddress);
            sub = subject;
            mailtext = text;
             mail.send(mailAddress,sub,mailtext);
            },
            function(errorObject){
              console.log('read failed' +errorObject.code);
            });

}

function setConfTime(stimestamp){
  refsent.child('config').set({timest:stimestamp});
  console.log("timestamp set");
}

function setMinusData(score,stext,stime){
  refmin.push().set({score:score, text:stext, time:stime});
}

exports.startserch = function(){
  console.log("Start serch");
  negserch();
  msg_sayjudg();
}
