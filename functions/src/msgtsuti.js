var admin = require('firebase-admin');
var mail = require('./mail_s.js');
//var serviceAccount = require('../../../secretKey/chat001-16c14-firebase-adminsdk-yzgox-706f3ac261.json');

const app1 = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chat001-16c14.firebaseio.com'
});

var moment = require('moment');
require('moment-timezone');

var db = admin.database();
var refmsg = db.ref('msgboard');
var refstats = db.ref('stats');
var subject = "ヘルパーロボホンからのお知らせ";

function msg_sayjudg(){
  refmsg.on('child_changed',function(data){
    listenflg = data.val().isListen;
    message = data.val().message;
    name = data.val().name;
    time = data.val().time;
    console.log("test1->" + listenflg);
    console.log("message->" + message);
    console.log("name->" + name);
    console.log("time->" + time);

    listentime = moment().tz("Asia/Tokyo").format("MM/DD HH:mm");
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
            mailtext = text;
            sub = subject;
             mail.send(mailAddress,sub,mailtext);

            },
            function(errorObject){
              console.log('read failed' +errorObject.code);
            });
}

msg_sayjudg();
