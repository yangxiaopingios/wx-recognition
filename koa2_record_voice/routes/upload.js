/**
 * Created by yangyang on 17/3/13.
 */

var router = require('koa-router')();
var multer = require('koa-multer');
var path = require('path');
var fs = require( 'fs');
var exec = require('child_process').exec;
var speech = require('../script/speech');

var upload = multer({ dest: path.resolve('./voice-file')});

/**
 * 上传录音文件
 */
router.post('/', upload.single('file'), async function (ctx, next) {

    console.log(ctx.req.file);
    //var res = await rename(path.resolve('./voice-file/' + ctx.req.file.filename), path.resolve('./voice-file/' + ctx.req.file.filename + '.' + ctx.req.file.originalname.split('.')[1]));
    //if (res.result){
    //    console.log('成功');
    //
    //}else {
    //    console.log('失败: ' + JSON.stringify(res.msg));
    //}
    //var exist = await exists(path.resolve('./voice-file/' + ctx.req.file.filename));
    //console.log(exist);
    //while (!exist){
    //    exist = await exists(path.resolve('./voice-file/' + ctx.req.file.filename));
    //}
    var result = {};
    var res = await silkToWav(path.resolve('./voice-file/' + ctx.req.file.filename));
    if (res.result){
        console.log('文件转换wav成功');
        var filePath = path.resolve('./voice-file/' + ctx.req.file.filename + '.wav');
        var base64Data = await speech.base64_encode(filePath);
        var fileInfo = await speech.fileStat(filePath);
        var recogniz = await speech.recognize(base64Data.msg, fileInfo.msg.size);
        result = {
            code: 200,
            msg : recogniz.msg
        };
        console.log(recogniz);

    }else {
        console.log('文件转换wav失败: ' + JSON.stringify(res.msg));
        result = {
            code: 88,
            msg : '文件转换wav失败: '
        };
    }

    ctx.response.body = result;
});

function rename(oldPath, newPath){

    return new Promise(function (resolve, reject) {
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                console.error(err);
                resolve({
                    result : false,
                    msg : err
                });
            }
            resolve({
               result : true,
                msg : ''
            });
        });
    });
}

function silkToWav(file){
    return new Promise(function (resolve, reject) {
        exec('sh converter.sh ' + file + ' wav', function(err,stdout,stderr){
            if(err) {
                resolve({
                    result : false,
                    msg : stderr
                });
            } else {
                //var data = JSON.parse(stdout);
                console.log(stdout);
                console.log(stderr);
                //console.log(err);
                resolve({
                    result : true,
                    msg : ''
                });
            }
        });
    });
}

function exists(file){
    return new Promise(function (resolve, reject) {
        fs.exists(file, function(exists){
            resolve(exists)
        });
    });
}

module.exports = router;