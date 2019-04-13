<template>
<div class="tip-sidebar">
  
  <Tooltip class="tip-icon-div-style" content="降温">
    <i-circle :size="100" :percent="80" stroke-color="#2db7f5">
        <span style="font-size:12px">℃</span>
        <Icon type="md-snow" size="55" 
        :class="(temperatureValue>temperatureThreshold)?'snow-icon-style rotate-loop':'snow-icon-style'" 
        @click="setTemperatureThreshold"/>
        <span style="font-size:12px">{{temperatureValue}}</span>
    </i-circle>
  </Tooltip>
  <Tooltip class="tip-icon-div-style" content="烘干">
    <i-circle :size="100" :percent="80" stroke-color="#ff5500">
        <span style="font-size:12px">%</span>
        <Icon type="md-sunny" size="55" 
        :class="(humidityValue>HumidityThreshold)?'sunny-icon-style rotate-loop':'sunny-icon-style'" 
        @click="setHumidityThreshold"/>
        <span style="font-size:12px">{{humidityValue}}</span>
    </i-circle>
  </Tooltip>
  <Tooltip class="tip-icon-div-style" content="照明">
    <i-circle :size="100" :percent="80" stroke-color="#FFFFDD">
        <span style="font-size:12px">lm</span>
        <Icon type="md-bulb" size="55"
        :class="(luxValue>luxThreshold)?'light-icon-style blink':'light-icon-style'" 
        @click="setLuxThreshold"/>
        <span style="font-size:12px">{{luxValue}}</span>
    </i-circle>
  </Tooltip>
  <Modal
    v-model="isShowSettingWindow"
    :title="settingWindowTitle"
    @on-ok="saveCallback">
    <Slider 
    show-tip="always"
    :min="sliderMin"
    :max="sliderMax"
    v-model="sliderValue"></Slider>
  </Modal>
</div>
</template>

<script>
import { mapGetters,mapActions } from "vuex";
  export default {
    name: 'tip-sidebar',
    computed: {
      ...mapGetters(["temperatureValue",
                    "humidityValue",
                    "luxValue"])
    },
    data(){
      return{
        temperatureThreshold:20,
        HumidityThreshold:20,
        luxThreshold:200,
        sliderValue:0,
        sliderMin:0,
        sliderMax:100,
        settingWindowTitle:"请设置温度阈值",
        isShowSettingWindow:false,
        saveCallback:this.saveHumidityThreshold
      }
    },
    methods: {
      setTemperatureThreshold() {
        this.settingWindowTitle = "请设置温度阈值"
        this.sliderValue = this.temperatureThreshold
        this.sliderMin = 0
        this.sliderMax = 100
        this.isShowSettingWindow = true
        this.saveCallback = this.saveTemperatureThreshold
      },
      setHumidityThreshold() {
        this.settingWindowTitle = "请设置湿度阈值"
        this.sliderValue = this.HumidityThreshold
        this.sliderMin = 0
        this.sliderMax = 100
        this.isShowSettingWindow = true
        this.saveCallback = this.saveHumidityThreshold
      },
      setLuxThreshold() {
        this.settingWindowTitle = "请设置光照阈值"
        this.sliderValue = this.luxThreshold
        this.sliderMin = 0
        this.sliderMax = 10000
        this.isShowSettingWindow = true
        this.saveCallback = this.saveLuxThreshold
      },
      saveTemperatureThreshold(){
        this.temperatureThreshold = this.sliderValue
      },
      saveHumidityThreshold(){
        this.HumidityThreshold = this.sliderValue
      },
      saveLuxThreshold(){
        this.luxThreshold = this.sliderValue
      }
    }
  }
</script>

<style scoped>
.tip-sidebar{
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  background-color: #bdc6c7;
}
.tip-icon-div-style{
  user-select: none;
  margin: 20px auto;
  cursor: pointer;
}
.snow-icon-style{
  display: block;
  color:#2db7f5;
  margin: 0;
}
.sunny-icon-style{
  display: block;
  color:#ff5500;
  margin: 0;
}
.light-icon-style{
  display: block;
  color:#FFFFDD;
  margin: 0;
}

@keyframes rotate-loop{
  0%{
    transform: rotate(0);
    }
  50%{
    transform:rotate(200deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
.rotate-loop{
    transition: 0.5s;
    transform-origin: center center;  
    animation: rotate-loop 2s linear infinite;  /*开始动画后无限循环，用来控制rotate*/
}

@keyframes blink {
  0%{
    transform: rotate(-10deg);
    }
  50%{
    transform:rotate(10deg);
  }
  100%{
    transform: rotate(-10deg);
  }
}
.blink{
    transition: 0.5s;
    transform-origin: center center;  
    animation: blink 1s linear infinite;  /*blink*/
}








</style>
