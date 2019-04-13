<template>
  <Menu
    style="height:95vh;overflow-y:scroll"
  >
    <MenuItem
      class="menu-item"
      name="1"
    >
      <font>串口号:</font>
      <Select
        v-model="portName"
        placeholder="请选择串口"
        :disabled="serialportOpened"
      >
        <Option
          v-for="item in portList"
          :key="item"
          :label="item"
          :value="item"
        >
        </Option>
      </Select>
    </MenuItem>

    <MenuItem
      class="menu-item"
      name="2"
    >
      <font>波特率:</font>
      <AutoComplete
        class="inline-input"
        v-model="baudRate"
        :data="baudRateList"
        :filter-method="baudRateQueryFilter"
        suffix-icon="el-icon-sort"
        :disabled="serialportOpened"
      >
      </AutoComplete>
    </MenuItem>

    <MenuItem name="3">
      <font>校验位:</font>
      <Select
        v-model="parity"
        placeholder="请选择校验位"
        :disabled="serialportOpened"
      >
        <Option
          label="无校验"
          value="none"
        ></Option>
        <Option
          label="奇校验"
          value="odd"
        ></Option>
        <Option
          label="偶校验"
          value="even"
        ></Option>
        <Option
          label="0校验"
          value="space"
        ></Option>
        <Option
          label="1校验"
          value="mark"
        ></Option>
      </Select>
    </MenuItem>

    <MenuItem name="4">
      <font>数据位:</font>
      <Select
        v-model="dataBits"
        placeholder="请选择数据位"
        :disabled="serialportOpened"
      >
        <Option
          label="5"
          :value="5"
        ></Option>
        <Option
          label="6"
          :value="6"
        ></Option>
        <Option
          label="7"
          :value="7"
        ></Option>
        <Option
          label="8"
          :value="8"
        ></Option>
      </Select>
    </MenuItem>

    <MenuItem name="5">
      <font>停止位:</font>
      <Select
        v-model="stopBits"
        placeholder="请选择停止位"
        :disabled="serialportOpened"
        class="select-style"
      >
        <Option
          label="1"
          :value="1"
        ></Option>
        <Option
          label="2"
          :value="2"
        ></Option>
      </Select>
    </MenuItem>

    <MenuItem name="6">
      <div class="item-size-limit">
        <font style="float:left">流控:</font>
        
        <CheckboxGroup
          :disabled="serialportOpened"
        >
          <Checkbox
            name="rtscts"
            label="rtscts"
            v-model="rtscts"
          >rtscts</Checkbox>
          <Checkbox
            name="xon"
            label="xon"
            v-model="xon"
          >xon</Checkbox>
          <Checkbox
            name="xoff"
            label="xoff"
            v-model="xoff"
          >xoff</Checkbox>
          <Checkbox
            name="xany"
            label="xany"
            v-model="xany"
          >xany</Checkbox>
        </CheckboxGroup>
      </div>
    </MenuItem>

    <MenuItem name="7">
      <div class="item-size-limit">
        <Button
          v-if="serialportOpened"
          @click="disconnect"
          style="width:95%"
        >断开连接</Button>
        <Button
          v-else
          @click="connect"
          style="width:94%"
        >连接串口</Button>
      </div>
    </MenuItem>


    <MenuItem name="8">
      <div class="item-size-limit">
      <font style="float:left">TCP透传使能：</font>
      <i-switch :disabled="tcpConnected" size="large" v-model="tcpTransmitOpened">
        <span slot="open">开启</span>
        <span slot="close">关闭</span>
      </i-switch>
      </div>
    </MenuItem>

    <MenuItem v-if="tcpTransmitOpened" name="9">
      <div class="item-size-limit">
      <font style="float:left">TCP透传模式：</font>
      <i-switch 
      :disabled="tcpConnected" 
      size="large" 
      @on-change="onChangeTcpMode" 
      v-model="tcpIntervalEnabled">
        <span slot="open">定时</span>
        <span slot="close">单次</span>
      </i-switch>
      </div>
    </MenuItem>

    <MenuItem v-if="tcpTransmitOpened" name="10">
      <div class="item-size-limit">
      <font style="float:left">IP地址:</font>
      <Input :disabled="tcpConnected" v-model="tcpServerIP" style="width:175px" />
      </div>
    </MenuItem>
    <MenuItem v-if="tcpTransmitOpened" name="11">
      <div class="item-size-limit">
      <font style="float:left">端口:</font>
      <InputNumber :disabled="tcpConnected" :min="1" :max="65535" v-model="tcpServerPort" style="width:175px" />
      </div>
    </MenuItem>
    <MenuItem v-if="tcpTransmitOpened && tcpIntervalEnabled" name="12">
      <div class="item-size-limit">
      <font style="float:left">定时时间(毫秒):</font>
      <InputNumber :disabled="tcpConnected" :min="500" v-model="tcpIntervalTime" style="width:175px" />
      </div>
    </MenuItem>

    <MenuItem v-if="tcpTransmitOpened" name="13">
      <div class="item-size-limit">
        <Button
          v-if="tcpConnected"
          @click="disconnectTCP"
          style="width:95%"
          :loading="tcpConnectButtonLoading"
        >断开连接</Button>
        <Button
          v-else
          @click="connectTCP"
          style="width:94%"
          :loading="tcpConnectButtonLoading"
        >创建连接</Button>
      </div>
    </MenuItem>



  </Menu>
</template>

<script>
import { mapGetters } from "vuex";
import { clearInterval } from "timers";
import SerialportControl from "./ControlSidebar/SerialportControl.js";
import Tcp from "./ControlSidebar/Tcp.js";
import store from '../store';
let net = require('net');
export default {
  name: "control-sidebar",
  mounted() {
    store.dispatch('setTcpIntervalEnabled',this.tcpIntervalEnabled);
    SerialportControl.startScan(
      () => {
        this.portList.length = 0;
      },
      port => {
        this.portList.push(port.comName);
      },
      () => {
        this.portList.sort();
        if (this.portList.indexOf(this.portName) === -1) {
          this.portName = "";
        }
      }
    );
  },
  destroyed() {
    SerialportControl.stopScan();
  },
  computed: {
    ...mapGetters(["serialportOpened","tcpSendBuffer"])
  },
  methods: {
    connect() {
      console.log({
        baudRate: parseInt(this.baudRate),
        parity: this.parity,
        dataBits: this.dataBits,
        stopBits: this.stopBits,
        rtscts: this.rtscts,
        xon: this.xon,
        xoff: this.xoff,
        xany: this.xany
      });
      if (this.portName === "") {
        return;
      }
      SerialportControl.connect(this.portName, {
        baudRate: parseInt(this.baudRate),
        parity: this.parity,
        dataBits: this.dataBits,
        stopBits: this.stopBits,
        rtscts: this.rtscts,
        xon: this.xon,
        xoff: this.xoff,
        xany: this.xany
      });
    },
    disconnect() {
      SerialportControl.disconnect();
    },
    baudRateQueryFilter(queryString,option){
      return option.indexOf(queryString) === 0;
    },
    onChangeTcpMode(enabled){
      store.dispatch('setTcpIntervalEnabled',enabled);
    },
    connectTCP(){
        if(net.isIP(this.tcpServerIP) === 0){
          this.$Message.error('IP地址格式不对！');
          return;
        }
        this.tcpConnectButtonLoading = true;
        setTimeout(() => {
          this.tcpConnectButtonLoading = false;
        }, 1000);
        if(this.client === null){
          this.client = Tcp.createSocket();
        }
        this.client.connect(parseInt(this.tcpServerPort),this.tcpServerIP,()=>{
          this.tcpConnected = true;
          store.dispatch('setTcpConnected',true);
        })
        this.client.on('data',(data) => {
            console.log('已接受服务器端发送的数据：'+data);
        });
        //监听与服务端连接的错误事件
        this.client.on('error',(err) => {
            console.error('在于服务器连接或通信过程中发生了一个错误，错误代码为%s',err);
            this.$Message.error(`在于服务器连接或通信过程中发生了一个错误，错误代码为${err.code}`);
            this.tcpConnected = false;
            store.dispatch('setTcpConnected',false);
            //当发生错误时，用destroy方法销毁该socket端口。确保不会再被利用
            this.client.destroy();
            this.client = null;
        });
      
        //监听结束事件
        this.client.on('end',(err) => {
            this.tcpConnected = false;
            store.dispatch('setTcpConnected',false);
        })
        if(this.tcpIntervalEnabled){
          this.tcpIntervalId = setInterval(() => {
            if(this.tcpConnected && this.tcpSendBuffer.length > 0 && this.client){
              this.client.write(Buffer.from(this.tcpSendBuffer))
            }
          }, parseInt(this.tcpIntervalTime));
        }
    },
    disconnectTCP(){
      this.client.end();
    }
  },
  data() {
    return {
      tcpTransmitOpened: false,
      tcpIntervalEnabled: false,
      tcpConnected: false,
      tcpIntervalTime: 1000,
      tcpIntervalId: 0,
      tcpServerPort: 3000,
      tcpServerIP: "127.0.0.1",
      tcpConnectButtonLoading:false,
      client: null,
      baudRateList: [
        "1200",
        "2400",
        "4800",
        "9600",
        "14400",
        "19200",
        "38400",
        "57600",
        "115200"
      ],
      baudRate: "9600",
      parity: "none",
      dataBits: 8,
      stopBits: 1,
      rtscts: false,
      xon: false,
      xoff: false,
      xany: false,
      portList: [],
      portName: ""
    };
  }
};
</script>

<style>
.menu-item {
  color: black;
}
.item-size-limit {
  margin: auto;
  text-align: center;
  overflow: hidden;
}

</style>
