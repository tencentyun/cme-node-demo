const router = require("koa-router")();
const uploadCtl = require("./../controllers/upload");

const uploadRouter = router.post("/ApplyUploadSign", uploadCtl.applyUploadSign);

module.exports = uploadRouter;
