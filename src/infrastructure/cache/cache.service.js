const { safeDelete, safeDeletePattern } = require("../../utils/cacheInvalidation");

const invalidateWalletRelatedCache = async () => {
    await safeDelete("CACHE:admin:dashboard:stats");
    await safeDeletePattern("CACHE:admin:wallet:*");
}
module.exports = invalidateWalletRelatedCache;