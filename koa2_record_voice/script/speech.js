/**
 * Created by yangyang on 17/3/15.
 */

var fs = require( 'fs');
var request = require('request');
var path = require('path');

var speech = {};
module.exports = speech;

speech.base64_encode = function(file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, function (err, data) {
            if (err) {
                resolve({
                    result : false,
                    msg : '出现错误: ' + JSON.stringify(err)
                });
            }else {
                resolve({
                    result : true,
                    msg : new Buffer(data).toString('base64')
                });
            }
        });
    });
}

speech.fileStat = function(file) {
    return new Promise(function (resolve, reject) {
        fs.stat(file, function (err, data) {
            if (err) {
                resolve({
                    'result' : false,
                    'msg' : '出现错误: ' + JSON.stringify(err)
                });
            }else {
                resolve({
                    'result' : true,
                    'msg' : data
                });
            }
        });
    });
}

speech.getAccessToken = function(){
    return new Promise(function (resolve, reject) {
        request({
            url: 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=（你自己的API key）&client_secret=（你自己的Secret Key）',
            method: 'get',
            headers: {
                'content-type': 'application/json'
            }
        }, function (error, response, data) {
            if (error){
                resolve({
                    'result' : false,
                    'msg' : '出现错误: ' + JSON.stringify(error)
                });
            }else {
                resolve({
                    'result' : true,
                    'msg' : data
                });
            }
        });
    });
}

speech.recognize = function(base64String, size){
    return new Promise(function (resolve, reject) {
        request({
            url: 'http://vop.baidu.com/server_api',
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                "format":"wav",
                "rate":16000,
                "channel":1,
                "token":'(你的token)',
                "cuid":"9e:eb:e8:d4:67:00",
                "len":size,
                "speech":base64String
            })
            //body: JSON.stringify({
            //    "format":"wav",
            //    "rate":16000,
            //    "channel":1,
            //    "token":'(你的token)',
            //    "cuid":'9eebe8d46700',
            //    "url":'http://ihealth-wx.s1.natapp.cc/download?name=123.wav',
            //    "callback":'http://ihealth-wx.s1.natapp.cc/callback'
            //})
        }, function (error, response, data) {
            if (error){
                resolve({
                    result : false,
                    msg : '出现错误: ' + JSON.stringify(error)
                });
            }else {
                resolve({
                    result : true,
                    msg : data
                });
            }
        });
    });
}

var ih_exec = async function(){
    //var access_token = await getAccessToken();
    //console.log(access_token);
    var base64Data = await speech.base64_encode(path.resolve('./123.wav'));
    var fileInfo = await speech.fileStat(path.resolve('./123.wav'));
    //console.log(base64Data);
    //console.log(fileInfo);
    //console.log(base64);
    var recogniz = await speech.recognize(base64Data.msg, fileInfo.msg.size);
    console.log(recogniz);
}

//ih_exec();
