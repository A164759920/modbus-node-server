const { APP_PORT } = require("./config.default.js");
const Koa = require("koa");
const cors = require("koa2-cors");
const server = new Koa();
//引入router
const { router } = require("./router/index.js");
const koaBody = require("koa-body");
//注册中间件
server
  .use(cors())
  .use(koaBody())
  .use(router.routes())
  .use(router.allowedMethods());

//启动服务器
server.listen(APP_PORT, () => {
  console.log(`server is running on:${APP_PORT}`);
});
