<template>
<div style="display:flex;flex-direction:column">
    <div class="receive-window">
      <Table :height="receiveWindowHeight" border :columns="titles" :data="receivedData"></Table>
    </div>
    <div style="min-height:50px;height:50px;border-bottom:1px solid #dcdee2;margin-bottom:10px">
      <Button class="button" @click="clear">清除接收框</Button>
    </div>
  </div>
</template>

<script>
import { mapGetters,mapActions } from "vuex";
  export default {
    name: 'receive-window',
    computed: {
      ...mapGetters(["receivedData"])
    },
    mounted(){
      this.receiveWindowHeight = document.getElementsByClassName("receive-window")[0].clientHeight -2
      window.onresize = ()=>{
      this.receiveWindowHeight = document.getElementsByClassName("receive-window")[0].clientHeight -2
      }
    },
    data(){
      return{
        receiveWindowHeight:100,
        titles: [
          {
            title:"时间戳",
            key:"time",
            width: 100,
            fixed: 'left'
          },
          {
            title:"原始数据",
            key:"originData"
          },
          {
            title:"解析数据",
            key:"parsedData"
          }
        ]
      }
    },
    methods: {
      clear(){
        this.clearData()
      },
      ...mapActions(['clearData'])
    }
  }
</script>

<style scoped>
  .button{
    margin: 10px 0;
  }
  .receive-window{
    overflow:scroll;
    flex:1;
  }
  .receive-window::-webkit-scrollbar{
    display:inherit
  }
</style>
