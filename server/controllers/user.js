const utils = require("./../utils/index");
const errcode = require("./../utils/errcode");

module.exports = {

    /*
    校验登录参数并下发cookie(demo这里不做校验，开发者根据自身业务需求进行校验并下发cookie)
     */
    async login(ctx) {
        const params = ctx.request.body;
        console.log(params);
        const account = params.Account.trim();

        if (account !== "") {
            ctx.cookies.set("userId", account, {
                domain: ctx.hostname,
                path: "/",
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: false
            });
            ctx.body = utils.buildResp(null);
        } else {
            ctx.body = errcode.loginErr;
        }
    }
};
