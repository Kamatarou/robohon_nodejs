var senderMailAddress = 'robotestmailer1001@gmail.com';
var senderMailPass = 'roborobohon898';

var mailer = require('nodemailer');
var admin = require('firebase-admin');

var serviceAccount = require("../confidential/vik/chat001-16c14-firebase-adminsdk-yzgox-e0940b30ea.json");

/*admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chat001-16c14.firebaseio.com'
});*/

var db = admin.database();
var refstats = db.ref('stats');
var refsent = db.ref('sentiment');
var refmin = db.ref('minus');
var mailAddress;
var score;
var text = "";
var time = "";

var transporter = mailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,   //TLS
    secure: false,
    requireTLS: true,
    auth:{
       user:senderMailAddress,
       pass:senderMailPass
      }
  });
  
exports.mail = async function(){  
  refstats.once('value',function(data){
     mailAddress = data.child('mailAddress').val();
     console.log(mailAddress);
     
  refsent.child('config').on('child_added',function(data){
    targettime = data.val();
    console.log('targettime = '+targettime);
   refmin.on('child_added',function(data){
     score = data.child('score').val();
     text = data.child('text').val();
     time = data.child('time').val();
     stime = data.child('searchtime').val();
     console.log(stime);
    if(stime == targettime){
       send(mailAddress,score,text,time);
    }
    
   });
  });
     
  },
  function(errorObject){
     console.log('read failed' +errorObject.code);
  });
    setTimeout(dboff,5000);
};

async function send(mailAddress,score,text,time){
  var mailset = {
    from: senderMailAddress,
    to: mailAddress,
    subject: 'testmail',
    text: score + ' ' + text + ' ' + time
  };

  await transporter.sendMail(mailset,function(error,info){
      if(error){
        console.log(error);
       }else{
        console.log('Mail send' +info.response);
       }
     });
};

async function dboff(){
  await db.app.delete();
  console.log('dboff');
  //process.exit(1);
};
