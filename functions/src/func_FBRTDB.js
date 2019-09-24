//Firebase RealtimeDatabse周りのことをする関数群
/**
 * 
 * 宣言セクション
 * 
 */
var firebase = require("firebase/app");
require("firebase/database");

//firebaseの初期化やら認証やら
const firebaseConfig = {
    apiKey: "AIzaSyBDRb11DoqqTO3DzsCGPfgRW8kAphD_kgo",
    authDomain: "chat001-16c14.firebaseapp.com",
    databaseURL: "https://chat001-16c14.firebaseio.com",
    projectId: "chat001-16c14",
    storageBucket: "chat001-16c14.appspot.com",
    messagingSenderId: "770731301137",
    appId: "1:770731301137:web:33fe6f619c17cb92"
  };
  firebase.initializeApp(firebaseConfig);

var database = firebase.database();

/**
 * 
 * 処理セクション
 * 
*/ 
exports.RTDBTester= function(Txt){
  if(!Txt){ Txt = "あああ"; }
  console.log("Text->"+ Txt);
  database.ref('test/').push().set({test : "hoge" , foo : "bar"}
  ,function(error){
    if(error){
      return {Result : "NG" , Stats : 200};
    }else{
      return {Result : "OK" , Stats : 500};
    }
  });
}

exports.RTDBSender = function(Txt){}