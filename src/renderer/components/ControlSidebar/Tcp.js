let net = require('net');
let client = null;
export default {
    createSocket(){
        client = new net.Socket();
        return client;
    },
    write(data) {
        client.write(data)
    }
}


