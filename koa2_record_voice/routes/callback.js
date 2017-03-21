/**
 * Created by yangyang on 17/3/15.
 */

var router = require('koa-router')();

//router.get('/', async function (ctx, next) {
//    console.log(ctx.request.body);
//});

router.post('/', async function (ctx, next) {
    console.log(ctx.request.body);
});

module.exports = router;