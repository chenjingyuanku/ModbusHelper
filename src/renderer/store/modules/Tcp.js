const state = {
    tcpSendBuffer: [],
    tcpSocket: null,
    tcpIntervalEnabled: false,
    tcpConnected: false
  }
  
  const getters = {
    tcpSocket: state => {
        return state.tcpSocket
    },
    tcpSendBuffer: state =>{
        return state.tcpSendBuffer
    },
    tcpIntervalEnabled: state => {
        return state.tcpIntervalEnabled
    },
    tcpConnected: state => {
        return state.tcpConnected
    }
  }
  
  const mutations = {
    SET_TCP_SOCKET (state,socket) {
        state.tcpSocket = socket
    },
    SET_TCP_SEND_BUFFER (state,buffer) {
        state.tcpSendBuffer.length = 0;
        for (let i = 0; i < buffer.length; i++) {
            state.tcpSendBuffer.push(buffer[i])
        }
    },
    SET_TCP_CONNECTED(state,connected){
        state.tcpConnected = connected
    },
    SET_TCP_INTERVAL_ENABLED(state,enabled){
        state.tcpIntervalEnabled = enabled
    }
  }
  
    const actions = {
        setTcpSocket ({ commit },socket) {
            commit('SET_TCP_SOCKET',socket)
        },
        setTcpSendBuffer ({ commit },buffer) {
            commit('SET_TCP_SEND_BUFFER',buffer)
        },
        setTcpConnected({commit},connected){
            commit('SET_TCP_CONNECTED',connected)
        },
        setTcpIntervalEnabled({commit},enabled){
            commit('SET_TCP_INTERVAL_ENABLED',enabled)
        }
    }
  
  export default {
    state,
    getters,
    mutations,
    actions
  }
  