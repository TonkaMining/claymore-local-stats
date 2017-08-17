const pollClaymoreMinerLocalStats = require('./pollClaymoreStats');


(function getStats() {
    console.log('--- Requesting Claymore Stats ---');
    console.log(`--- TIME: ${new Date().getTime()} ---`);

    pollClaymoreMinerLocalStats();

    global.setTimeout(() => {
        getStats();
    }, 1000);
})();
