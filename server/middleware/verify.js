const errcode = require('./../utils/errcode')

module.exports = async (ctx, next) => {
    if (ctx.path != '/User/Login') {
        const userId = ctx.cookies.get('userId')
        if (userId === '') {
            ctx.body = sessionNotFound
            return
        } else {
            ctx.request.userId = userId
        }
    }
    await next()
}