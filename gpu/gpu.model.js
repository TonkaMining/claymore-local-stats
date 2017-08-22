const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gpuSchema = Schema({
    cardId: { type: String, index: true, unique: true },
    manufacturer: String,
    model: String,
    memory: Number,
    rig: String,
    rigPosition: Number,
    mhs: Number,
    coreVoltage: Number,
    coreClock: Number,
    memoryClock: Number,
    cost: Number,
    power: Number,
    purchaseDate: Date
}, { collection: 'gpus' });

const GpuModel = mongoose.model('GpuModel', gpuSchema);

module.exports = GpuModel;
