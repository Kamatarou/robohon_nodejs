//変数設定
var json_obj = {
    name : "koutarou iwanaga",
    age : 21,
    home : "Awara City, Fukui Pref, Jp",
    email : "i.koutarou.ohara@gmail.com"
};

//関数をモジュール化して書き出し
exports.result = function(){
    var json = json_obj;
    return json;
}

exports.hensu = function(hoge,foo){
    var json_baa = {
        hoge : hoge,
        foo : foo
    }
    return json_baa;
}

exports.test = function(){
    return "aaa";
}

var module = function(){
    return "modeles000";
}
exports.module = module;