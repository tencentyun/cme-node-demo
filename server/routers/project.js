const router = require('koa-router')()
const projectCtl = require('./../controllers/project')

const projectRouter = router
    .post('/CreateProject', projectCtl.createProject)
    .post('/DescribeProjects', projectCtl.describeProjects)
    .post('/ExportVideoEditProject', projectCtl.exportVideoEditProject)
    .post('/ImportMediaToProject', projectCtl.importMediaToProject)
    .post('/DescribeTaskDetail', projectCtl.describeTaskDetail)

module.exports = projectRouter