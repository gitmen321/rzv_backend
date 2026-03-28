const { safeDelete, safeDeletePattern } = require("../../utils/cacheInvalidation");

const invalidateAdminDashboardCache = async () => {
    await safeDelete("CACHE:admin:dashboard:stats");
    await safeDeletePattern("CACHE:admin:wallet:*");
}
module.exports = invalidateAdminDashboardCache;