const { crc16 } = require("easy-crc");
const { SerialPort } = require("serialport");

// 连接池
const connectPool = require("../Storage/index.js");

/**
 *  创建modbus对象
 * */
async function initModBus(port, address) {
  const instance = new SerialPort({
    path: port,
    baudRate: 9600,
  });
  return new Promise((resolve, reject) => {
    instance.on("open", (data) => {
      const instanceObj = {
        address,
        instance,
      };
      // 加入连接池
      connectPool.set(port, instanceObj);
      resolve({
        code: 0,
        msg: `${port}-连接成功`,
      });
    });
    instance.on("error", (error) => {
      reject({
        code: 1,
        msg: `${port}-连接失败`,
        error: error.message,
      });
    });
  });
}

/**
 * 订阅消息
 * @param {Object} instance 串口实例
 * @param {Number} funNumber ModBus功能号
 * @returns Promise
 */
async function messageSubscrib(instance, funNumber) {
  return new Promise((resolve, reject) => {
    instance.on("data", (data) => {
      resolve({
        code: 0,
        funNumber,
        data,
      });
    });
  });   
}

/**
 * 读取寄存器指定值
 * 示例：02(address) 03(功能号) 00 00(起始地址) 00 03(寄存器数量) +CRC校验两位
 */
async function readRegister(port, address, reStart, reLength) {
  const buffer = [];
  const addressHex = address.toString(16).padStart(2, "0") + " ";
  buffer.push(`0x${addressHex}`);
  buffer.push(`0x03`); //功能号
  const reStartHex = reStart.toString(16).padStart(4, "0");
  buffer.push(`0x${reStartHex.slice(0, 2)}`);
  buffer.push(`0x${reStartHex.slice(2, 4)}`);
  const reLengthHex = reLength.toString(16).padStart(4, "0");
  buffer.push(`0x${reLengthHex.slice(0, 2)}`);
  buffer.push(`0x${reLengthHex.slice(2, 4)}`);
  let crc = crc16("MODBUS", Buffer.from(buffer)).toString(16).padStart(4, "0");
  buffer.push(`0x${crc.slice(2, 4)}`);
  buffer.push(`0x${crc.slice(0, 2)}`);
  //   console.log("read结果", Buffer.from(buffer));
  // 发送读指令帧
  const { instance } = connectPool.get(port);
  instance.write(Buffer.from(buffer));
  try {
    const res = await messageSubscrib(instance, 3);
    if (res) {
      const returnDataLength =
        parseInt(res.data.toString("hex").slice(4, 6), 16) * 2;
      const realData = res.data.toString("hex").slice(6, 6 + returnDataLength);
      return Promise.resolve({
        code: 0,
        msg: "读取成功",
        data: realData,
      });
    }
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject({
      funNumber: "03指令响应失败",
      error,
    });
  }
}

/**
 * 向指定寄存器写值
 * 示例：02(address) 06(功能号) 00 03(寄存器地址) 00 FE(写入的值)
 */
async function writeRegister(port, address, reStart, reData) {
  const buffer = [];
  const addressHex = address.toString(16).padStart(2, "0") + " ";
  buffer.push(`0x${addressHex}`);
  buffer.push(`0x06`); //功能号
  const reStartHex = reStart.toString(16).padStart(4, "0");
  buffer.push(`0x${reStartHex.slice(0, 2)}`);
  buffer.push(`0x${reStartHex.slice(2, 4)}`);
  const reDataHex = reData.toString(16).padStart(4, "0");
  buffer.push(`0x${reDataHex.slice(0, 2)}`);
  buffer.push(`0x${reDataHex.slice(2, 4)}`);
  console.log("原始数据", Buffer.from(buffer));
  let crc = crc16("MODBUS", Buffer.from(buffer)).toString(16).padStart(4, "0");
  buffer.push(`0x${crc.slice(2, 4)}`);
  buffer.push(`0x${crc.slice(0, 2)}`);
  console.log("write结果", Buffer.from(buffer));
  // 发送写指令帧
  const { instance } = connectPool.get(port);
  instance.write(Buffer.from(buffer));
  try {
    const res = await messageSubscrib(instance, 6);
    if (res) return Promise.resolve(res);
  } catch (error) {
    return Promise.reject({
      funNumber: "06指令响应失败",
      error,
    });
  }
}
/**
 * 连接modbus
 */
async function connectController(ctx) {
  const { port, address } = ctx.request.body;
  // 先判断连接池中是否有本次请求连接的port
  if (connectPool.has(port)) {
    ctx.body = {
      code: 0,
      msg: `${port}-连接已存在`,
    };
  } else {
    try {
      const res = await initModBus(port, address);
      if (res) {
        ctx.body = res;
      }
    } catch (error) {
      ctx.body = error;
    }
  }
}
/**
 * 读取modbus指定寄存器的值
 */
async function readModBusController(ctx) {
  // 寄存器起始地址 + 寄存器数量
  const { port, address, reStart, reLength } = ctx.request.body;
  try {
    const res = await readRegister(port, address, reStart, reLength);
    ctx.body = res;
  } catch (error) {
    ctx.body = error;
  }
}
/**
 * 修改modbus指定寄存器的内容
 */
async function writeModBusController(ctx) {
  const { port, address, reStart, reData } = ctx.request.body;
  try {
    const res = await writeRegister(port, address, reStart, reData);
    if (res) {
      ctx.body = res;
    }
  } catch (error) {
    ctx.body = error;
  }
}
// 向modbus写值
module.exports = {
  connectController,
  readModBusController,
  writeModBusController,
};
