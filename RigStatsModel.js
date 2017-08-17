const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rigStatsSchema = Schema({
    time: Number,
    version: String,
    runningTime: String,
    hashrateWithShares: String,
    gpuHashrates: String,
    dcrHashrateWithShares: String,
    dcrHashrate: String,
    gpuTempsAndFanSpeeds: String,
    pools: String,
    invalidSharesAndPoolSwitches: String
});

const RigStatsModel = mongoose.model('RigStatsModel', rigStatsSchema);

module.exports = RigStatsModel;
