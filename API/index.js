const axios = require("axios");
const DOMAIN = "http://api.heclouds.com";
const accessToken =
  "version=2018-10-31&res=products%2F583419&et=1680594001&method=md5&sign=fdSIAKXJakBX30adrnBt3w%3D%3D";

/**
 * @description 根据设备名称获取设备信息
 * @param {String} deviceName 设备名称
 * @returns {object} data 查询数据
 * @example
 * 返回值示例
 *  code:0,
 *  data:{
 *    device_id:"xxx",
 *    name:"xxx",
 *    pid:"xxx",
 *    key:"xxx"
 *  }
 */
async function getDeviceByName(deviceName) {
  try {
    const res = await axios.get(`${DOMAIN}/mqtt/v1/devices/${deviceName}`, {
      headers: {
        Authorization: accessToken,
      },
    });
    const { code_no, code } = res.data;
    if (code_no === "000000") {
      return {
        code: 0,
        data: res.data.data,
      };
    } else {
      return {
        code: 1,
        data: code,
      };
    }
  } catch (error) {
    return {
      code: 2,
      data: error,
    };
  }
}
/**
 * @description  获取传感器数据流
 * @param {String} id 设备ID
 * @example
 *  返回值示例
 * code:0,
 * data: {
 *    "temperature":"23",
 *    "foam":"23",
 *    "oxygen":"15",
 *    "pH":"7"
 *  }
 */
async function getDataStreamByID(id) {
  try {
    const res = await axios.get(`${DOMAIN}/devices/${id}/datapoints`, {
      headers: {
        Authorization: accessToken,
      },
      params: {
        datastream_id: `temperature,foam,oxygen,pH`,
        sort: "DESC",
        limit: 1,
      },
    });
    const { errno } = res.data;
    if (errno === 0) {
      const { datastreams } = res.data.data;
      const tempMap = {};
      datastreams.forEach((item) => {
        tempMap[item.id] = item.datapoints[0].value;
      });
      return {
        code: 0,
        data: tempMap,
      };
    } else {
      return {
        code: 1,
        data: res.data.error,
      };
    }
  } catch (error) {
    return {
      code: 2,
      data: error,
    };
  }
}
/**
 * @description 根据ID获取设备镜像state 【reported字段】
 * @param {String} id 设备ID
 * @example
 * 返回值示例
 *  "code": 0,
    "data": {
        "baseState": "0",
        "hotState": "0",
        "whiskState": "0",
        "acidState": "0",
        "coldState": "0",
        "controlState": "0"
    }
 */
async function getImageStateByID(id) {
  try {
    const res = await axios.get(`${DOMAIN}/mqtt/v1/devices/${id}/image`, {
      headers: {
        Authorization: accessToken,
      },
    });
    const { code_no, code } = res.data;
    if (code_no === "000000") {
      const { reported, desired } = res.data.data.properties.state;
      return {
        code: 0,
        data: reported,
      };
    } else {
      return {
        code: 1,
        data: code,
      };
    }
  } catch (error) {
    return {
      code: 2,
      data: error,
    };
  }
}

/**
 * @description 更新设备镜像state 【desired字段】
 * @param {String} id 设备ID
 * @param {Object} newStates 更新的数据
 * @example
 *  newStates示例
 *  {
 *    "deviceID": "1059893029",
 *    "newStates":{
 *      "controlState": "1",
 *      "coldState": "1"
 *    }
 *  }
 */
async function updateImageStateByID(id, newStates) {
  try {
    const res = await axios.put(
      `${DOMAIN}/mqtt/v1/devices/${id}/image/properties`,
      {
        state: {
          desired: newStates,
        },
      },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    const { code, code_no, data } = res.data;
    if (code_no === "000000") {
      return {
        code: 0,
        data: data.state.desired,
      };
    } else {
      return {
        code: 1,
        data: code,
      };
    }
  } catch (error) {
    return {
      code: 2,
      data: error,
    };
  }
}

module.exports = {
  getDeviceByName,
  getDataStreamByID,
  getImageStateByID,
  updateImageStateByID,
};
