/**
 * Created by yangyang on 17/3/16.
 */

const request = require('request');
const path = require('path');
const fs = require( 'fs');
const querystring = require('querystring');
const images = require("images");
const Agent = require('socks5-http-client/lib/Agent');

var image = {};
module.exports = image;

/**
 * 2017-3-16
 * {"access_token":"24.7a2689bc4788aa314abb8bf31822b2fb.2592000.1492247275.282335-9406049",
 * "session_key":"9mzdDFQYYj24HifmHHltVcCv4yx8FNLCi09diU2JUZlFyZP7naRrCEfVNXCF2fPRfYC5ROcse7g0viG+9Vky8ZmaxGkl",
 * "scope":"public vis-ocr_ocr vis-ocr_bankcard brain_ocr_scope wise_adapt lebo_resource_base lightservice_public hetu_basic lightcms_map_poi kaidian_kaidian wangrantest_test wangrantest_test1 bnstest_test1 bnstest_test2 ApsMisTest_Test\\u6743\\u9650 vis-classify_flower",
 * "refresh_token":"25.01acc05d2b979e4f52df99d4e85e8ee5.315360000.1805015275.282335-9406049",
 * "session_secret":"af49dcb3a1ce15af2ea8bb7ae916444d",
 * "expires_in":2592000}\n' }
 */
image.getAccessToken = function(){
    return new Promise(function (resolve, reject) {
        request({
            url: 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=CO7BPe9VjvEOGxYSTZ3FA6My&client_secret=MHhOA1HSTEwryGG71nng3aFqPXCcYO4b',
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

image.recognizeImage = function (base64String) {
    return new Promise(function (resolve, reject) {

        var data = querystring.stringify({
            image:base64String,
            detect_direction: true
        });

        request({
            url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token=24.7a2689bc4788aa314abb8bf31822b2fb.2592000.1492247275.282335-9406049',
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body:data
        }, function (error, response, data) {
            if (error) {
                resolve({
                    result: false,
                    msg: '出现错误: ' + JSON.stringify(error)
                });
            } else {
                resolve({
                    result: true,
                    msg: JSON.parse(data)
                });
            }
        });
    });
}

image.base64_encode = function(file) {
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

image.fileStat = function(file) {
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

async function exec(){

    //var getAccessToken = await image.getAccessToken();
    //console.log(getAccessToken);

    var fileInfo = await image.fileStat(path.resolve('./222.jpg'));
    console.log(fileInfo);

    await images(path.resolve('./222.jpg'))                     //Load image from file
        .size(2300)
    //加载图像文件
        .save(path.resolve('./333.jpg'), {               //Save the image to a file,whih quality 50
            quality : 100                    //保存图片到文件,图片质量为50
        });

    var base64String = await image.base64_encode(path.resolve('./333.jpg'));
    //console.log(base64String.msg);
    //
    var recognizeImage = await image.recognizeImage(base64String.msg);
    //var recognizeImage = await image.recognizeImage('');

    console.log(JSON.stringify(recognizeImage));
}

//exec();

