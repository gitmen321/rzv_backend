const eventBus = require("../../core/eventBus");
const invalidateWalletRelatedCache = require("../cache/cache.service");

eventBus.on("WALLET_UPDATED", async (payload) => {

    await invalidateWalletRelatedCache();
})