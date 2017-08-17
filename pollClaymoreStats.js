const dotenv = require('dotenv').load();
const RigStatsModel = require('./RigStatsModel');

const PORT = process.env.PORT || 3333;
const LOCAL_IP = process.env.LOCAL_IP || '118.119.207.199';

/**
 * Expects a response in the shape of:
 * ```javascript
 * {
 *     "id": 0,
 *     "error": null,
 *     "result": [
 *         "9.7 - ETH",
 *         "1489",
 *         "78471;1657;2",
 *         "12390;31306;12456;12178;10139",
 *         "0;0;0",
 *         "off;off;off;off;off",
 *         "71;100;67;32;65;45;66;45;66;33",
 *         "us2.ethermine.org:4444",
 *         "0;30;0;0"
 *     ]
 * };
 * ```
 *
 * @param response {object}
 */
function saveStats(response) {
    const parsedResponse = JSON.parse(response);

    if (!parsedResponse.result) {
        console.log('No data to parse');

        return;
    }

    const currentStats = parsedResponse.result;
    const model = new RigStatsModel();

    model.time = new Date().getTime();
    model.version = currentStats[0];
    model.runningTime = currentStats[1];
    model.hashrateWithShares = currentStats[2];
    model.gpuHashrates = currentStats[3];
    model.dcrHashrateWithShares = currentStats[4];
    model.dcrHashrate = currentStats[5];
    model.gpuTempsAndFanSpeeds = currentStats[6];
    model.pools = currentStats[7];
    model.invalidSharesAndPoolSwitches = currentStats[8];

    model.save()
        .then((response) => {
            console.log('RigStatsModel saved!', model);
        })
        .catch((error) => {
            throw new Error(`Something went terribly wrong::: ${error}`);
        });
}

function pollClaymoreMinerLocalStats() {
    const socket = require('net').Socket();

    socket.setEncoding('ascii');
    socket.connect(PORT, LOCAL_IP);
    socket.write('{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}');

    socket.on('data', (response) => saveStats(response));
    socket.end();
}

module.exports = pollClaymoreMinerLocalStats;
