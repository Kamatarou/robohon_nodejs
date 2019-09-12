// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
//Cloud Functionsを動かす大事なものが詰まったFirebase SDK、これ必須
const functions = require('firebase-functions');

var express = require('express');
// ルーティングするで
var router = express.Router();

// routerにルーティングの動作を書いてく
router.get('/',function(req,res){
    res.json({
        message:"Hello,world"
    });
});

//routerをモジュールとして扱う準備
module.exports = router;