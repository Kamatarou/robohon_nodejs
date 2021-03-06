/*****************
 * 
 * 定義セクション
 * 
 *****************/

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
//Cloud Functionsを動かす大事なものが詰まったFirebase SDK、これ必須
const functions = require('firebase-functions');

//色々便利にしてくれるexpressも導入
const express = require('express');

// The Firebase Admin SDK to access the Firebase Realtime Database.
//　Firebase Adimi SDK は　Firebase Realtime Databaseにつなぎに行くのに多分要ります。
//const admin = require('firebase-admin');
//admin.initializeApp();

const app = express();

var bodyParser = require('body-parser');

//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/************
 * 自作関数類
 ************/
//自作関数の読み取り
const funcs = require('./src/functions.js'); 
//Dialogflow周りの受け渡し諸々を行う関数の読み取り
const func_dialogflowAPI = require('./src/func_dialogflow.js');
//FirebaseRealtimeDB周りの投げ飛ばしを行う関数の読み取り
const func_Firebase = require('./src/func_FBRTDB.js');
//NaturalLanguage周りの受け渡しを行う関数の読み取り
const func_NaturalLang = require('./src/func_NaturalLang.js');
//ネガ要素を監視したり伝言の監視をする関数の読み取り
const func_negsearch = require('./src/negsearch.js');
//メールを送りつける関数の読み取り
const func_Mails = require('./src/mail_s.js');
//NaturalLanguageの結果の集計を行う関数の読み取り
const func_Collects = require('./src/collect_s.js');
//とりあえずメッセージ送る関数
//const func_msgtsuti = require('./src/msgtsuti');

/******************
 * 
 * 処理セクション
 * 
 ******************/

//関数が読めたときにゲッター関数常駐(?)
if(func_Firebase){
    func_Firebase.RTDBGetter();
}

if(func_negsearch){
    func_negsearch.startserch();    
}

//関数が読めたときに定期的にコレクト＆メール処理を行う関数
/*if(func_Monitor){
    if(func_Collect && func_Mail){
        //interval = 1000 * 60 * 60;
        var interval = 1000;
        func_Monitor.monitorMail(interval);
        
    }
}*/

/*app.get('',(request,response) => {

})*/

//お試しレスポンス１
app.get('/timestamp', (request, response) => {
  response.send(`${Date.now()}`);
});

//お試しレスポンス２
app.get('/message', (request, response) => {
    var msg = "たくさんのメッセージですはようメッセージまみれになろうや";
    response.send(msg);
});

//お試しレスポンス3
app.get('/funcs', (require, response) => {
    if(require.query.q){
        var result = funcs.hensu(require.query.q,12345);
    }
    else{
        var result = funcs.result();
    }
    //var module = funcs.module();
    response.send(result);
});

//お試しAPI
app.get('/api/v1/p1/testapi', (request, response) =>{
    response.header('Content-Type', 'application/json; charset=utf-8');
    var json_R = { Result : "OK" , message : "Hello!!!!!!!!!"};
    console.log("message->" + json_R.message)
    response.status(200).json(json_R);
});

//お試しAPI2
app.get('/api/v1/p2/testapi', (request, response) =>{
    response.header('Content-Type', 'application/json; charset=utf-8');
    func_dialogflowAPI.get_Intent("こんにちは").then(value =>{
        response.send(value);
    });
});

//お試しAPI3
app.get('/api/v1/p3/testapi', (require, response) =>{
    //?sentence=文のなかみ
    response.header('Content-Type', 'application/json; charset=utf-8');
    var sentence = require.query.s;
    if(sentence){
        var json_R = { Result : "OK" , message : "Hello!!!!!!!!!" , input : sentence};
        response.status(200).json(json_R);
    }
    else{
        var json_E = { Result : "NG" , message : "You Mast input 'sentence' (?s=<free word>)"};
        response.status(500).json(json_E);
    }
});

//お試しAPI4
app.get('/api/v1/p4/testapi', (request, response) =>{
    func_Firebase.RTDBSender("てすと","Bot").then(value=>{
        console.log("result ->" + value);
        response.status(200).send(); 
    })
});

//お試しAPI5
app.get('/api/v1/p5/testapi', (request, response) =>{
    func_NaturalLang.get_Sentiment("こんにちは").then(value=>{
        console.log("result ->" + value);
        response.status(200).send(value); 
    })
});

//お試しAPI6
app.get('/api/v1/p6/testapi', (request, response) =>{
    var testj = {Result:"OK", Text : "テスト", score : 0.01, magnitude : 0.005};
    var fkey = "0000000000000000";
    func_Firebase.RTDBSend_Sentiment(testj,fkey).then(value=>{
        console.log("result ->" + value);
        response.status(200).send(); 
    })
});

//お試しAPI7
app.get('/api/v1/p7/testapi', (request, response) =>{
    response.header('Content-Type', 'application/json; charset=utf-8');
    var word = request.query.s;
    var fkey = "0000000000000000";
    func_dialogflowAPI.get_Intent(word).then(value =>{
        func_Firebase.RTDBSend_Params(value,fkey).then(v =>{
            response.send(value);
        });
    });
});

//お試しAPI8
app.get('/api/v1/p8/testapi', (request, response) =>{
    
});

//お試しAPI9
app.get('/api/v1/p9/testapi', (request, response) =>{
    var word = request.query.s;
    let face = request.query.f;
    var fkey = "0000000000000001";
    func_dialogflowAPI.get_Intent(word).then(value =>{
        func_Firebase.RTDBSend_Params(value,fkey,face).then(v =>{
            response.send(value);
        });
    });
});

/**
 * 本番API
 **/
app.get('/api/v1/hubapi',(require,response)=>{
    response.header('Content-Type', 'application/json; charset=utf-8');
    var sentence = require.query.s;
    //var faceUser = require.query.face;
    var fkey;
    if(sentence){
        func_Firebase.RTDBSender(sentence,"Android").then(key =>{fkey = key});
        func_dialogflowAPI.get_Intent(sentence).then(value =>{
            var json_R = value;
            func_Firebase.RTDBSend_Params(json_R,fkey);
            func_NaturalLang.get_Sentiment(sentence).then(result =>{
                //console.log("fkey->"+fkey);
                func_Firebase.RTDBSend_Sentiment(result,fkey);
                func_Firebase.RTDBSender(json_R.Response,"Bot");
                response.status(200).json(json_R);
                //console.log("sendmail");
                //func_Collect.datapic();
                //func_Mail.mail();
            }); 
        });
    }
    else{
        var json_E = { Result : "NG" , Response : "You Mast input 'sentence' (?s=<free word>)"};
        response.status(500).json(json_E);
    }
});

//他所のディレクトリ下にあるindex.jsファイルを引っ張ってきてuseでつかるように
//var router = require('./route/v1/');
//app.use('/api/test/v1', router);

exports.app = functions.https.onRequest(app);