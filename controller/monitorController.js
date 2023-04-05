const {
  getDeviceByName,
  getDataStreamByID,
  getImageStateByID,
  updateImageStateByID,
} = require("../API/index");

/**
 * @api {get} /mqtt/getDevice/:deviceName 获取设备信息
 * @apiName 获取设备信息
 * @apiGroup device
 *
 * @apiParam {String} deviceName 设备名称
 * @apiParamExample {json} Request-Example:
 * {
 *  "deviceName":"mqtt-can1"
 * }
 *
 * @apiSuccess {Number} code 0
 * @apiSuccess {Object} data 设备信息
 * @apiSuccessExample {json} Response-Example:
 * {
 *  code:0,
 *  data:{
 *    device_id:"xxx",
 *    name:"xxx",
 *    pid:"xxx",
 *    key:"xxx"
 *  }
 * }
 */
async function getDeviceController(ctx) {
  const { deviceName } = ctx.query;
  try {
    const res = await getDeviceByName(deviceName);
    if (res) {
      ctx.body = res;
    }
  } catch (error) {
    ctx.body = {
      code: 2,
      data: error,
    };
  }
}
/**
 *
 *
 */
async function getDataStreamController(ctx) {
  const { deviceID } = ctx.query;
  try {
    const res = await getDataStreamByID(deviceID);
    if (res) {
      ctx.body = res;
    }
  } catch (error) {
    ctx.body = {
      code: 2,
      data: error,
    };
  }
}

async function getImageStateController(ctx) {
  const { deviceID } = ctx.query;
  try {
    const res = await getImageStateByID(deviceID);
    if (res) {
      ctx.body = res;
    }
  } catch (error) {
    ctx.body = {
      code: 2,
      data: error,
    };
  }
}

async function updateImageStateController(ctx) {
  const { deviceID, newStates } = ctx.request.body;
  try {
    const res = await updateImageStateByID(deviceID, newStates);
    if (res) {
      ctx.body = res;
    }
  } catch (error) {
    ctx.body = {
      code: 2,
      data: error,
    };
  }
}
module.exports = {
  getDeviceController,
  getDataStreamController,
  getImageStateController,
  updateImageStateController,
};
