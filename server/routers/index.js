const router = require('koa-router')()
const user = require('./user')
const project = require('./project')
const upload = require('./upload')

router.use('/User', user.routes(), user.allowedMethods())
router.use('/Project', project.routes(), project.allowedMethods())
router.use('/Upload', upload.routes(), upload.allowedMethods())
module.exports = router