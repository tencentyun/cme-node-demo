const router = require('koa-router')()
const userCtl = require('./../controllers/user')

const userRouter = router
    .post('/Login', userCtl.login)

module.exports = userRouter