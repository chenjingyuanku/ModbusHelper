const state = {
  receivedData:[],
  serialportOpened: false,
  temperatureValue:10,
  humidityValue:10,
  luxValue:10
}

const getters = {
  serialportOpened: state => {
    return state.serialportOpened
  },
  receivedData: state =>{
    return state.receivedData
  },
  temperatureValue: state => {
    return state.temperatureValue
  },
  humidityValue: state =>{
    return state.humidityValue
  },
  luxValue: state =>{
    return state.luxValue
  },
}

const mutations = {
  SET_SERIALPORT_STATE_OPEN (state) {
    state.serialportOpened = true
  },
  SET_SERIALPORT_STATE_CLOSE (state) {
    state.serialportOpened = false
  },
  PUSH_NEW_DATA (state,data) {
    let date = new Date()
    let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    
    state.receivedData.push({
      time:time,
      ...data
    })
    while(state.receivedData.length > 50){
      state.receivedData.shift();
    }
  },
  CLEAR_DATA (state) {
    state.receivedData.length = 0
    state.receivedData.sort()
  },
  SET_TEMPERATURE_VALUE(state,value){
    state.temperatureValue = value
  },
  SET_HUMIDITY_VALUE(state,value){
    state.humidityValue = value
  },
  SET_LUX_VALUE(state,value){
    state.luxValue = value
  }
}

const actions = {
  setSerialportStateOpen ({ commit }) {
    commit('SET_SERIALPORT_STATE_OPEN')
  },
  setSerialportStateClose ({ commit }) {
    commit('SET_SERIALPORT_STATE_CLOSE')
  },
  pushNewData({ commit }, data) {
    commit('PUSH_NEW_DATA',data)
  },
  clearData({ commit }) {
    commit('CLEAR_DATA')
  },
  setTemperatureValue({ commit }, value) {
    commit('SET_TEMPERATURE_VALUE',value)
  },
  setHumidityValue({ commit }, value) {
    commit('SET_HUMIDITY_VALUE',value)
  },
  setLuxValue({ commit }, value) {
    commit('SET_LUX_VALUE',value)
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
