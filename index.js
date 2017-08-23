const dotenv = require('dotenv').load();
const mongoose = require('mongoose');
const pollClaymoreMinerLocalStats = require('./scripts/pollClaymoreStats');

const mongoUri = process.env.MONGODB_URI;
const INTERVAL_DELAY_MS = 1000 * 60 * 5; // 5 minutes

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connect(mongoUri, { useMongoClient: true }, (err, res) => {
    if (err) {
        console.log (`ERROR connecting to: ${mongoUri} - ${err}`);

        return;
    }

    console.log (`Succeeded connected to: ${mongoUri}`);
});

(function getStats() {
    console.log('--- Requesting Claymore Stats ---');
    console.log(`--- TIME: ${new Date().getTime()} ---`);

    pollClaymoreMinerLocalStats();

    global.setTimeout(() => {
        getStats();
    }, INTERVAL_DELAY_MS);
})();
