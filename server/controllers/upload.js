const utils = require("./../utils/index");
const errcode = require("./../utils/errcode");
const sign = require("../utils/sign");

module.exports = {
    //获取上传签名
    async applyUploadSign(ctx) {
        let data = {sign: sign.getUploadSign(ctx.request.userId)};
        ctx.body = utils.buildResp(data);
        console.debug(ctx.body);
    }
};
