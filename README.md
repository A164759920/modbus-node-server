# ModBus-node 串口通信服务器

## 连接至 modbus

- API: connect

  - method: POST
  - params:
    - **port**:端口号 eg:COM2
    - **address**:设备 ID 号(Demical) eg:1

- API read

  - method:POST
  - params:
    - **port**:端口号 eg:COM2
    - **address**:设备 ID 号(Demical) eg:1
    - **reStart**:读寄存器起始地址(Demical)
    - **reLength**:读寄存器的个数(Demical)

- API write

  - method:POST
  - params:
    - **port**:端口号 eg:COM2
    - **address**:设备 ID 号(Demical) eg:1
    - **reStart**:写寄存器的地址(Demical)
    - **reData**:写入寄存器的内容
