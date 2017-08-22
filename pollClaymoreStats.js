const dotenv = require('dotenv').load();
const rigStatController = require('./rigStat/rigStat.controller');
const gpuController = require('./gpu/gpu.controller');
const gpuStatController = require('./gpuStat/gpuStat.controller');

const PORT = process.env.PORT || 3333;
const LOCAL_IP = process.env.LOCAL_IP || '118.119.207.199';

// used only for testing
// const CLAYMORE_RESPONSE_MOCK = JSON.stringify({
//     id: 0,
//     error: null,
//     result: [
//         "9.7 - ETH",
//         "1635",
//         "93439;2174;2",
//         "12038;29362;12489;10039;29509",
//         "0;0;0",
//         "off;off;off;off;off",
//         "66;88;66;35;67;50;66;35;67;31",
//         "us2.ethermine.org:4444",
//         "0;0;0;0"
//     ]
// });

function saveStats(response) {
    rigStatController.saveRigStat(response);

    gpuController.getGpuListByRigPosition().then((gpuList) =>  {
        gpuStatController.saveGpuStats(response, gpuList);
    });
}

function pollClaymoreMinerLocalStats() {
    // return saveStats(CLAYMORE_RESPONSE_MOCK);
    const socket = require('net').Socket();

    socket.setEncoding('ascii');
    socket.connect(PORT, LOCAL_IP);
    socket.write('{id:0,jsonrpc:"2.0","method":"miner_getstat1"}');

    socket.on('data', (response) => saveStats(response));
    socket.end();
}

module.exports = pollClaymoreMinerLocalStats;
