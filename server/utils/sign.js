const querystring = require('querystring')
const crypto = require('crypto')
const config = require('./../../config')

module.exports = {
    //申请打开项目签名，官网链接[]
    getOpenProjectSign(projectId, userId) {
        let current = parseInt((new Date()).getTime() / 1000)
        let expired = current + 86400  // 签名有效期：1天

        let args = {
            secretId: config.secretId,
            currentTimeStamp: current,
            expireTime: expired,
            random: Math.round(Math.random() * Math.pow(2, 32)),
            platform: config.platform,
            projectId: projectId,
            userId: userId
        }

        return genSha1Sign(args)
    },

    getUploadSign(userId) {
        let current = parseInt((new Date()).getTime() / 1000)
        let expired = current + 86400  // 签名有效期：1天

        let args = {
            secretId: config.secretId,
            currentTimeStamp: current,
            expireTime: expired,
            random: Math.round(Math.random() * Math.pow(2, 32)),
            platform: config.platform,
            action: "CreateUploadMaterial",
            userId: userId
        }

        return genSha1Sign(args)
    },

    //申请上传签名，官网链接[]
    applyUploadSign(subAppId = 0) {
        let current = parseInt((new Date()).getTime() / 1000)
        let expired = current + 7200  // 签名有效期：2小时
        let args = {
            secretId: config.secretId,
            currentTimeStamp: current,
            expireTime: expired,
            random: Math.round(Math.random() * Math.pow(2, 32))
        }
        if (subAppId) {
            args["vodSubAppId"] = subAppId
        }else if (config.vodSubAppId){
            args["vodSubAppId"] = config.vodSubAppId
        }
        console.debug("args ", args)
        return genSha1Sign(args);
    }
}


function genSha1Sign(args) {
    let original = querystring.stringify(args)
    let originalBuffer = Buffer.from(original, "utf8")
    let hmac = crypto.createHmac("sha1", config.secretKey)
    let hmacBuffer = hmac.update(originalBuffer).digest()
    let signature = Buffer.concat([hmacBuffer, originalBuffer]).toString("base64")
    return signature
}