import store from '../../store'
import Tcp from "./Tcp.js";
const SerialPort = require('serialport')
const crc = require('node-crc')
let serialport = null
let scanInvId = -1
function parseData(data){
  if(data.length > 5){
    let crcNumber = crc.crc(16, true, 0xa001, 0, 0xffff, 0, 0, 0, 
      Buffer.from(data.slice(0,data.length-2)))
    if(crcNumber[1] === data[data.length - 2] && 
      crcNumber[0] === data[data.length - 1]){
        //校验通过
        if(data[0] === 0x02){
          switch (data[1]) {
            case 0x05:
              let temp = (data[3]*256+data[2])*0.1
              store.dispatch('setTemperatureValue',temp)
              return `当前温度:${temp}℃`
            case 0x07:
              let humidity = (data[3]*256+data[2])
              store.dispatch('setHumidityValue',humidity)
              return `当前湿度:${humidity}%`
            case 0x09:
              let lux = (data[3]*256+data[2])
              store.dispatch('setLuxValue',lux)
              return `当前光照:${lux}lm`
            default:
              break
          }
        }
      }
  }
  return data
}

export default {
  connect(comName,config){
    serialport = new SerialPort(comName, config)
    serialport.on('open',(err)=>{
      if(err){
        return console.error('Error opening port: ',err.message)
      }
      store.dispatch('setSerialportStateOpen')
    })
    serialport.on('close',(err)=>{
      if(err){
        return console.error('Error closing port: ',err.message)
      }
      store.dispatch('setSerialportStateClose')
    })
    serialport.on('data',(data)=>{
      if(!store.getters.tcpIntervalEnabled && store.getters.tcpConnected){
        Tcp.write(data)
      }
      store.dispatch('setTcpSendBuffer',data);
      store.dispatch('pushNewData',{
        originData:(()=>{
          let hex = ""
          for (let i = 0; i < data.length; i++) {
            hex += (data[i]>15?"":"0")+data[i].toString(16)+','
          }
          return hex.substring(0,hex.length - 1)
        })(),
        parsedData:parseData(data)
      })
    })
  },
  disconnect(){
    if(serialport !== null){
      serialport.close()
    }
  },
  startScan(resetCallback,freshCallback,endCallback){
    scanInvId = setInterval(() => {
      if(serialport !== null && serialport.isOpen===true){
        return
      }
      resetCallback()
      SerialPort.list().then(
        ports => ports.forEach(port => {
          freshCallback(port)
        }),
        err => console.error(err)
      ).then(
        ()=>{
          endCallback()
        }
      )
    }, 1000)
  },
  stopScan(){
    clearInterval(scanInvId)
    scanInvId = -1
  },
  send(data){
    if(serialport !== null){
      serialport.write(data)
    }
  }
}
