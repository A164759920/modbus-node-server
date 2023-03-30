const axios = require("axios");
const DOMAIN = "http://api.heclouds.com";
const accessToken =
  "version=2018-10-31&res=products%2F583419&et=1685360975&method=md5&sign=530vEjl56zCFt0GV8m7jxA%3D%3D";

/**
 * @description 根据设备名称获取设备信息
 * @param {String} deviceName
 * @returns {Object}
 */
async function getDeviceByName(deviceName) {
  try {
    const res = await axios.get(`${DOMAIN}/mqtt/v1/devices/${deviceName}`, {
      headers: {
        Authorization: accessToken,
      },
    });
    console.log("返回值", res.data.data);
    return {
      code: 0,
      data: res.data.data,
    };
  } catch (error) {
    return {
      code: 1,
      data: error,
    };
  }
}
/**
 * @description  获取传感器数据流
 * @param {String} id
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
        code: errno,
        data: tempMap,
      };
    } else {
      return {
        code: errno,
        data: res.data.error,
      };
    }
  } catch (error) {
    console.log("接口错误", res.data);
  }
}
/**
 * @description 根据ID获取设备镜像state
 * @param {String} id
 */
async function getImageStateByID(id) {
  try {
    const res = await axios.get(`${DOMAIN}/mqtt/v1/devices/${id}/image`, {
      headers: {
        Authorization: accessToken,
      },
    });
    const { code_no, code } = res.data;
    console.log(res.data);
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
      code: 1,
      data: error,
    };
  }
}

/**
 * @description 更新设备镜像state
 * @param {Object} stateData
 */
async function updateStateData(id, newStates) {
  try {
    const res = await axios.put(
      `${DOMAIN}/mqtt/v1/devices/${id}/image/properties`,
      {
        data: {
          newStates,
        },
      },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
  } catch (error) {}
}

module.exports = {
  getDeviceByName,
  getDataStreamByID,
  getImageStateByID,
  updateStateData,
};
