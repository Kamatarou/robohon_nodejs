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
//お試しレスポンス１
app.get('/timestamp', (request, response) => {
  response.send(`${Date.now()}`);
});

//お試しレスポンス２
app.get('/message', (request, response) => {
    var msg = "たくさんのメッセージですはようメッセージまみれになろうや";
    response.send(msg);
});

//お試しAPI
app.get('/api/v1/testapi', (request, response) =>{
    response.header('Content-Type', 'application/json; charset=utf-8');
    var json_R = { Result : "OK" , message : "Hello!!!!!!!!!"};
    response.status(200).json(json_R);
});

//本題
app.get('/api/v1/hubapi', (require, response) =>{
    //?sentence=文のなかみ
    response.header('Content-Type', 'application/json; charset=utf-8');
    var sentence = require.query.s;
    if(sentence){
        var json_R = { Result : "OK" , message : "Hello!!!!!!!!!" , input : sentence};
        response.status(200).json(json_R);
    }
    else{
        var json_E = { Result : "NG" , message : "You Mast input 'sentence'"};
        response.status(400).json(json_E);
    }
});

exports.app = functions.https.onRequest(app);
