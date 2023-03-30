const Router = require("koa-router");
const router = new Router();

const {
  connectController,
  readModBusController,
  writeModBusController,
} = require("../controller/serialController.js");

const {
  getDeviceController,
  getDataStreamController,
  getImageStateController,
  updateImageStateController,
} = require("../controller/monitorController.js");
router.post("/connect", connectController);
router.post("/read", readModBusController);
router.post("/write", writeModBusController);

router.get("/mqtt/getDevice", getDeviceController);
router.get("/mqtt/getDataStream", getDataStreamController);
router.get("/mqtt/getImageState", getImageStateController);
router.post("/mqtt/updateImageState", updateImageStateController);

module.exports = {
  router,
};
