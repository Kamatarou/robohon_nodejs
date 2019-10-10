
var admin = require('firebase-admin');

var serviceAccount = require("../confidential/vik/chat001-16c14-firebase-adminsdk-yzgox-e0940b30ea.json");
/*admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chat001-16c14.firebaseio.com'
});*/
var moment = require('moment');
require('moment-timezone');

var db = admin.database();
var refsent = db.ref('sentiment');
var refmin = db.ref('minus');
var mscore;
var mtext = "";
var mtime = "";
var a = 1;
var now = moment().unix();
var starttime;

exports.datapic = function(){
 
  refsent.child('config').once('child_added',function(data) {
    starttime = data.val();
   console.log('starttime = '+starttime);
  
 
  refsent.on('child_added',function(snapshot){
       snapshot.forEach(function(data){
          key = data.key;
          value = data.val();
          score = snapshot.child('Score').val();
          text = snapshot.child('Text').val();
          time = snapshot.child('time').val();
          timestamp = snapshot.child('timestamp').val();
         if(starttime < timestamp && timestamp < now) {    
          if(key === 'Score' && score < 0){
            mscore = score;
            console.log(key+a+':'+value);
            console.log(mscore);
            
          }
          if(key === 'Text' && score < 0){
            mtext = text;
            console.log(key+a+':'+value);
            console.log(mtext);
            
          }
          if(key === 'time' && score < 0){
            mtime = time;
            console.log(key+a+':'+value);
            console.log(mtime);
            
            
          }
          if(score < 0 && mtext !== "" && mtime !== ""){
            refmin.push().set({score:mscore, text:mtext, time:mtime, searchtime:now} ,function(err){
              if(err){
                //接続失敗
                console.error(err);
              }
              else{
                //接続成功
                console.log("Success Send *Collect*");
                //console.log("send Data-> " + json);
              }
            });
            initvalue();
            //a++;
          }
         }
       });
     });    
  });
       
        setTimeout(dboff,5000);
};

function initvalue(){
  mtext = "";
  mtime = "";
}


function stamp(){
  
  refsent.child('config').set({timestamp:now});
  
  console.log('now ='+now);
  
};

function dboff(){
  stamp();
  db.app.delete();
  console.log('dboff');
  process.exit(1);
}


