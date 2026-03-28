const eventBus = require("../../core/eventBus");
const invalidateAdminDashboardCache = require("../cache/cache.service");

eventBus.on("WALLET_UPDATED", async () => {

    await invalidateAdminDashboardCache();
});

eventBus.on("USER_STATUS_UPDATE", async () => {
    await invalidateAdminDashboardCache();
});