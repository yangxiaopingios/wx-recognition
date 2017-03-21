/**
 * Created by yangyang on 17/3/15.
 */

var router = require('koa-router')();
var fs = require( 'fs');
var path = require('path');

router.get('/',async function(ctx, next){
    var fileName = ctx.request.query.name;
    console.log(fileName);
    var exists = await exist(fileName);
    if (exists){
        ctx.attachment(fileName);
        let filePath = path.resolve('./script/' + fileName);
        ctx.body = await fs.readFileSync(filePath);
    }else {
        console.log(123);
        ctx.response.set("Content-type","text/html");
        ctx.response.body = "file not exist!";
    }

});

function exist(fileName){
    return new Promise(function(resolve, reject){
        fs.exists(path.resolve('./script/' + fileName), function (exists) {
            if (exists){
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
}

module.exports = router;