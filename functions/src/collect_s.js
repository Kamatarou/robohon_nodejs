var admin = require('firebase-admin');
var mail = require('./mail_s.js');

var serviceAccount = require("../confidential/vik/chat001-16c14-firebase-adminsdk-yzgox-e0940b30ea.json");

const app1 = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chat001-16c14-a23ae.firebaseio.com/'
},"app_colect");
var moment = require('moment');
require('moment-timezone');

var db = admin.database(app1);
var refprm = db.ref('00000000');

var refstats = db.ref('stats');

//var now = moment().unix();

//var refslp = db.ref('sleeptime');
var cnt = 0;
var daytext = "";
var subject = "ヘルパーロボホンからの警告";
var sendslpmailflg = false;
//var alwsleep = moment("2019-10-29 23:00").tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm");

async function sleepcheck(){
    console.log("function sleepcheck")

     refstats.once('value',function(statsdata){
      sendslpmailflg = statsdata.child('sendslpmail').val();

    //寝た時間の検索、取得
        refprm.child('morning').child('dabcdefgh').on('child_changed',function(data){
          var changeval = data.val();
          //console.log('slptime->' + slptime);
          var saytime = moment().format("MM/DD");
          if(!isNaN(changeval)){
            var slptime = changeval;
            console.log("数値部分が更新");

            if((0<=slptime)&&(slptime<8)||(slptime==12||(slptime>=24))){
              console.log("flg_a");
              slptimeinfo = saytime + "　" + slptime + "時台\n";
              daytext += slptimeinfo;
              cnt++;
            }
            else{
              console.log("flg_b");
              slpmailflgchangeF();
              cnt = 0;
              daytext = "";
            }

          }

          console.log('saytime->' + saytime);
          console.log('slptime->' + slptime);

          console.log(cnt);

          if(cnt >= 3){
            if(sendslpmailflg){
              text = "寝る時間が遅い日が4日以上続いています。様子を見てあげましょう。\n\n最近の寝た時間帯\n" + daytext;
            }else{
              text = "寝る時間が遅い日が3日続いています。様子を見てあげましょう。\n\n最近の寝た時間帯\n" + daytext;
              slpmailflgchangeT();
            }
            mailer(subject,text);
          }

     });
  });

};


async function mailer(subject,text){

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

function slpmailflgchangeT(){
  refstats.child('sendslpmail').set(true);
  sendslpmailflg = true;
}

function slpmailflgchangeF(){
  refstats.child('sendslpmail').set(false);
  sendslpmailflg = false;
}

/*
function add_slowslp(slptimeInt,saytime2){
  refstats.child('slowtime').push().set({sleepday:saytime2,sleeptime:slptimeInt});
  console.log('slowtime added');
}

function pic_slowslp(){
  refstats.ref('slowtime').limitToLast(3).on('child_added',function(data){
    slptime = data.val().sleeptime;
    slpday = data.val().sleepday;

  });
}
*/

/*
async function remove_slowslp(){
  refslp.child('slowtime').set(null);
  console.log("remove");
}
*/

function stamp(){
  refsent.child('config').set({timestamp:now});
  console.log('now ='+now);
}



function dboff(){
  //stamp();
  db.app.delete();
  console.log('dboff');
}

sleepcheck();
//mailer();
//slpmailflgchangeF();
