const Koa = require("koa");
const static = require("koa-static");
const path = require("path");
const bodyParser = require("koa-bodyparser");
const config = require("./../config");
const koaLogger = require("koa-logger");
const routers = require("./routers/index");
const verifySession = require("./middleware/verify");

const app = new Koa();

app.use(static(path.join(__dirname, "./../static")));

app.use(koaLogger());
app.use(bodyParser());
app.use(verifySession);
app.use(routers.routes()).use(routers.allowedMethods());

let sys = require("os");
let networkInfo = sys.networkInterfaces();

let host = "127.0.0.1";
if (networkInfo.eth0 && networkInfo.eth0[0]) {
  host = networkInfo.eth0[0].address;
}

app.listen(config.port, host, () => {
  console.log(`server start at ${host}:${config.port}`);
});
