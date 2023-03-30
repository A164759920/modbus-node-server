const {
  getDeviceByName,
  getDataStreamByID,
  getImageStateByID,
  updateStateData,
} = require("../API/index");

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
    const res = await updateStateData(deviceID, newStates);
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
};
