<template>
  <div id="app">
        <div class="aside-collapse-background">
          <div class="aside-collapse-button" @click="change" 
          :style="serialportOpened?'color:#5df05d':'color:white'">

          <Icon v-if="isShow" type="md-arrow-round-forward" />
          <Icon v-else type="md-arrow-round-back" />
          </div>
        </div>
      <transition name="smooth">
        <div v-if="isShow" class="aside-menu">
          <control-sidebar/>
        </div>

      </transition>
      
          <div class="content-style">
            <receive-window style="height:60vh"/>
            <transmit-window style="height:35vh"/>
          </div>
          <div class="aside-tip">
            <tip-sidebar />
          </div>
          <div style="float:clear"></div>
  </div>
</template>

<script>
  import ControlSidebar from '@/components/ControlSidebar'
  import TransmitWindow from '@/components/TransmitWindow'
  import ReceiveWindow from '@/components/ReceiveWindow'
  import TipSidebar from '@/components/TipSidebar'
  import { mapGetters } from 'vuex'
  export default {
    name: 'simple-serialport',
    components: {
      ControlSidebar,TransmitWindow,ReceiveWindow,TipSidebar
    },
    computed:{
      ...mapGetters(['serialportOpened'])
    },
    methods: {
      change(){
        this.isShow = !this.isShow;
      }
    },
    data(){
      return{
        isShow:true
      }
    }
  }
</script>

<style>
#app{
  display: flex;
  flex-wrap: nowrap;
}
  .aside-collapse-background{
    min-width: 20px !important;
    max-width: 20px !important;
    width:20px !important;
    height: 100vh !important;
    flex-grow:0;
  }
  .aside-menu{
    width: 240px;
    max-width: 240px;
    min-width: 240px;
    flex-grow:0;
    height:100vh;
    overflow: auto;
  }
  .content-style{
    flex:1;
    flex-grow:1;
    height: 100vh;
    padding: 0 10px;
    overflow: hidden;
  }
  .aside-tip{
    width:120px;
    border-left: 1px solid #dcdee2;
    /*background-color:#ababab*/
  }
  .aside-collapse-button{
    height: 100%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: gray;
    color: rgb(255, 255, 255);
    overflow: hidden;
    transition: all 0.2s;
  }
  .aside-collapse-button:hover{
    box-shadow: 0px 0px 15px 4px rgba(218, 211, 152, 0.75) inset;
  }

  .aside-menu::-webkit-scrollbar{
    display: none
  }
  body{
    overflow:hidden
  }
  body::-webkit-scrollbar{
    display: none
  }
  .smooth-enter-active {
    animation: smooth-in .3s;
  }
  .smooth-leave-active {
    animation: smooth-in .3s reverse;
  }
@keyframes smooth-in {
  0% {
    transform: scale(0);
    width: 0px;
  }
  50% {
    transform: scale(1.12);
  }
  100% {
    transform: scale(1);
  }
}
</style>
