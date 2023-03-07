const Router = require("koa-router");
const router = new Router();

const {
  connectController,
  readModBusController,
  writeModBusController,
} = require("../controller/serialController.js");

router.post("/connect", connectController);
router.post("/read", readModBusController);
router.post("/write", writeModBusController);

module.exports = {
  router,
};
