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
 *
 * @apiSuccess {Number} code 状态标识符
 * @apiSuccess {Object} data 设备信息
 * @apiSuccessExample {json} Response-Example:
 * {
 *    "code":0,
 *    "data":{
 *          "device_id":"xxx",
 *          "name":"xxx",
 *          "pid":"xxx",
 *          "key":"xxx"
 *    }
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
 * @api {get} /mqtt/getDataStream/:deviceID 获取设备数据流
 * @apiName 获取设备数据流
 * @apiGroup device
 *
 * @apiParam {String} deviceID 设备ID
 *
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Object} data 设备信息
 * @apiSuccessExample {json} Response-Example:
 * {
 *    "code":0,
 *    "data": {
 *          "temperature":"23",
 *          "foam":"23",
 *          "oxygen":"15",
 *          "pH":"7"
 *    }
 * }
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

/**
 * @api {get} /mqtt/getImageState/:deviceID 获取设备镜像状态
 * @apiName 获取设备镜像状态
 * @apiGroup device
 *
 * @apiParam {String} deviceID 设备ID
 *
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Object} data 镜像状态数据
 * @apiSuccessExample {json} Response-Example:
 * {
 *    "code": 0,
      "data": {
            "baseState": "0",
            "hotState": "0",
            "whiskState": "0",
            "acidState": "0",
            "coldState": "0",
            "controlState": "0"
      }
    }
 *
 */
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

/**
 * @api {post} /mqtt/updateImageState/ 更新设备镜像desired
 * @apiName 更新设备镜像desired
 * @apiGroup device
 *
 * @apiParam {String} deviceID 设备ID
 * @apiParam {Object} newStates 用于update的数据
 * @apiParamExample {json} Resquest-Example:
 * {
 *    "deviceID":1234567,
 *    "newStates":{
 *          "controlState":"0",
 *          "hotState":"0"
 *    }
 * }
 *
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Object} data 设备信息
 * @apiSuccessExample {json} Response-Example:
 * {
 *  code:0,
 *  data: {
        "request_id": "xxxx",
        "code": "000000",
        "code_no": "onenet_common_success",
        "message": null,
        "data": {
        "state": {
            "desired": {
                "color": "green"
            },
            "reported": {
                "color": "red"
            }
        },
 *    }
 * }
 *
 */
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
