<template>
  
<div style="display:flex;flex-direction:column">
  <div style="flex-grow:1">
      <textarea class="ivu-input" 
      v-model="transmit_text"
      style="height:calc(40vh - 60px);resize: none;"/>
  </div>
    <div style="min-height:50px;height:50px;flex-grow:0;flex:0 0 auto;">
    <Button class="button" @click="clear">清除发送框</Button>
    <Button class="button" @click="send">发送字符串</Button>
    <Tooltip content="字节之间可以用逗号，空格分割或者不分割">
      <Button class="button" @click="sendHex">发送HEX</Button>
    </Tooltip>
    <Tooltip content="温度单位摄氏度，设置值可以是小数">
      <Button class="button" @click="sendTemperature">设置温度</Button>
    </Tooltip>
    <Tooltip content="湿度单位百分比，设置值为整数">
      <Button class="button" @click="sendHumidity">设置湿度</Button>
    </Tooltip>
    <Tooltip content="光照单位流明，设置值为整数">
      <Button class="button" @click="sendLux">设置光照</Button>
    </Tooltip>
    </div>
  </div>
</template>

<script>
import SerialportControl from "./ControlSidebar/SerialportControl.js"
const crc = require('node-crc')
  export default {
    name: 'transmit-window',
    data(){
      return{
        transmit_text:""
      }
    },
    methods: {
      calcCrc(arr){
        return crc.crc(16, true, 0xa001, 0, 0xffff, 0, 0, 0, Buffer.from(arr))
      },
      clear(){
        this.transmit_text = "";
      },
      send(){
        SerialportControl.send(this.transmit_text)
      },
      sendHex(){
        let hexCode = this.transmit_text.replace(/,/g,'').replace(/ /g,'')
        let hexNumber = 0
        let hexArray = []
        //判断十六进制字符串
        if(/^[0-9a-fA-F]{1,}$/.test(hexCode) && (hexCode.length%2) === 0){
          for (let i = 0; i < hexCode.length-1; i+=2) {
            hexNumber = parseInt('0x'+hexCode[i]+hexCode[i+1])
            hexArray.push(hexNumber)
          }
          SerialportControl.send(new Uint8Array(hexArray))
        }else{
          this.$Message.error('HEX数据格式不对哦！');
        }
      },
      sendTemperature(){
        let protocolArray = [2,5]/*[0x01,0x04,0x01]*/
        //是非负浮点数
        if(/^\d+(\.\d+)?$/.test(this.transmit_text)){
          let temp = Math.round(parseFloat(this.transmit_text) * 10)
          protocolArray.push(temp%256)
          protocolArray.push(parseInt(temp/256))
          let result = this.calcCrc(protocolArray)
          protocolArray.push(result[1],result[0])
          SerialportControl.send(new Uint8Array(protocolArray))
        }else{
          this.$Message.error('温度数据格式不对哦！');
        }
      },
      sendHumidity(){
        let protocolArray = [0x01,0x06,0x01]
        //是非负整数
        if(/^\d+$/.test(this.transmit_text)){
          let humidity = parseInt(this.transmit_text)
          protocolArray.push(humidity%256)
          protocolArray.push(parseInt(humidity/256))
          let result = this.calcCrc(protocolArray)
          protocolArray.push(result[1],result[0])
          SerialportControl.send(new Uint8Array(protocolArray))
        }else{
          this.$Message.error('湿度数据格式不对哦！');
        }
      },
      sendLux(){
        let protocolArray = [0x01,0x08,0x01]
        //是非负整数
        if(/^\d+$/.test(this.transmit_text)){
          let lux = parseInt(this.transmit_text)
          protocolArray.push(lux%256)
          protocolArray.push(parseInt(lux/256))
          let result = this.calcCrc(protocolArray)
          protocolArray.push(result[1],result[0])
          SerialportControl.send(new Uint8Array(protocolArray))
        }else{
          this.$Message.error('光照数据格式不对哦！');
        }
      }
    }
  }
</script>

<style scoped>
  .button{
    margin: 10px 0 0 0;
  }
</style>
