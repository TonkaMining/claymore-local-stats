const dotenv = require('dotenv').load();
const rigStatController = require('../rigStat/rigStat.controller');

const PORT = process.env.PORT || 3333;
const LOCAL_IP = process.env.LOCAL_IP || '118.119.207.199';
const RIG_NAME = process.env.RIG_NAME || 'tonka1';

function pollClaymoreMinerLocalStats() {
    const socket = require('net').Socket();

    socket.setEncoding('ascii');
    socket.connect(PORT, LOCAL_IP);
    socket.write('{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}');

    socket.on('data', (response) => rigStatController.saveRigStat(response, RIG_NAME));
    socket.end();
}

module.exports = pollClaymoreMinerLocalStats;
