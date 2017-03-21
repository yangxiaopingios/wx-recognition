/**
 * Created by yangyang on 17/3/16.
 */

var router = require('koa-router')();
var multer = require('koa-multer');
var path = require('path');
var fs = require( 'fs');
var image = require('../script/image');
var images = require("images");

var upload = multer({ dest: path.resolve('./image-file')});

/**
 * 上传图片文件
 */
router.post('/', upload.single('file'), async function (ctx, next) {
    console.log(ctx.req.file);

    var newPath = path.resolve('./image-file/' + ctx.req.file.filename + '.' + ctx.req.file.originalname.split('.')[1]);

    var res = await rename(path.resolve('./image-file/' + ctx.req.file.filename), newPath);
    var body;
    if (res.result){
        console.log('成功');

        var fileInfo = await image.fileStat(newPath);
        console.log(fileInfo);
        console.log(50000/fileInfo.msg.size);

        if (fileInfo.msg.size > 80000){

            await images(newPath)                     //Load image from file
            //加载图像文件
                .size(2300)
                .save(newPath, {               //Save the image to a file,whih quality 50
                    quality : 100                    //保存图片到文件,图片质量为50
                });

            fileInfo = await image.fileStat(newPath);

            console.log(fileInfo.msg.size);

        }

        var base64String = await image.base64_encode(newPath);

        var recognizeImage = await image.recognizeImage(base64String.msg);

        console.log(recognizeImage);

        body = {
            code: 200,
            msg: recognizeImage.msg
        }

    }else {
        console.log('失败: ' + JSON.stringify(res.msg));

        body = {
            code: 88,
            msg: JSON.stringify(res.msg)
        }

    }

    ctx.response.body = body;
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

function compressImage(file){
    return new Promise(function (resolve, reject) {
        im.resize({
            srcPath: file,
            dstPath: 'kittens-small.jpg',
            width:   256,
            quality: 0.8
        }, function(err, stdout, stderr){
            if (err) {
                resolve(false);
            }else {
                resolve(true);
            }
        });

    });
}

module.exports = router;