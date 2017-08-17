const PORT = process.env.PORT || 3333;
const LOCAL_IP = process.env.LOCAL_IP || '118.119.207.199';
const INTERVAL_DELAY_MS = 100 * 60 * 60;

function pollClaymoreMinerLocalStats() {
    const socket = require('net').Socket();

    socket.setEncoding('ascii');
    socket.on('data', (response) => {
        console.log(response.toString());
    });

    socket.connect(3333, LOCAL_IP);
    socket.write('{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}');

    socket.end();
}

module.exports = pollClaymoreMinerLocalStats;
