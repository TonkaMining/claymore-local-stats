const _chunk = require('lodash').chunk;
const mongoose = require('mongoose');
const GpuModel = require('../gpu/gpu.model');
const GpuStatModel = require('./gpuStat.model');

const DELIMITER = ';';
const HASING_POWER_INDEX = 3;
const TEMP_AND_FAN_SPEEDS_INDEX = 6;

function hydrateGpuStatModelInstance(gpuModel, hashRate, temp, fanSpeed) {
    const gpuStatModel = new GpuStatModel();

    gpuStatModel.cardId = gpuModel.cardId;
    gpuStatModel.rig = gpuModel.rig;
    gpuStatModel.rigPosition = gpuModel.rigPosition;
    gpuStatModel.hashRate = hashRate;
    gpuStatModel.temperature = temp;
    gpuStatModel.fanSpeed = fanSpeed;

    return gpuStatModel;
}

/**
 *
 * {
 *     "id": 0,
 *     "error": null,
 *     "result": [
 *         "9.7 - ETH",
 *         "1635",
 *         "93439;2174;2",
 *         "12038;29362;12489;10039;29509",
 *         "0;0;0",
 *         "off;off;off;off;off",
 *         "66;88;66;35;67;50;66;35;67;31",
 *         "us2.ethermine.org:4444",
 *         "0;0;0;0"
 *     ]
 * }
 *
 * @function extractGpuStatsFromRigStats
 * @param rigStats {string}
 * @param gpulist {array<GpuModel>}
 */
function extractGpuStatsFromRigStats(rigStats, gpuList) {
    const rigStatsJson = JSON.parse(rigStats);
    const hashingPower = rigStatsJson.result[HASING_POWER_INDEX].split(DELIMITER);
    const tempAndFanSpeed = _chunk(rigStatsJson.result[TEMP_AND_FAN_SPEEDS_INDEX].split(DELIMITER), 2);

    return { hashingPower, tempAndFanSpeed };
}

function saveGpuStats(response, gpuList) {
    const { hashingPower, tempAndFanSpeed } = extractGpuStatsFromRigStats(response, gpuList);

    for (let i = 0; i < gpuList.length; i++) {
        const gpu = gpuList[i];
        const hashRate = hashingPower[i];
        const gpuTempAndFanSpeed = tempAndFanSpeed[i];
        const gpuStatModel = hydrateGpuStatModelInstance(
            gpu,
            hashRate,
            gpuTempAndFanSpeed[0],
            gpuTempAndFanSpeed[1]
        );

        console.log('---- --- ----');
        console.log(gpuStatModel);

        gpuStatModel.save()
        .catch((error) => {
            console.error('::: Error:', error);
        });

        console.log('---- --- ----');
    }
}

module.exports = {
    saveGpuStats: saveGpuStats
};
