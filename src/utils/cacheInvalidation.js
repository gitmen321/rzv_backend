const redisClient = require("../config/redis");
const structuredLogger = require('../utils/structured-logger');
//currently we're using keys, it's okay for now, but need changes when app need huge scale

const safeDelete = async (key) => {
    try {
        if (!redisClient.isReady) return;
        await redisClient.del(key);
    } catch (err) {
        structuredLogger.warn("Cache delete skipped", err);
    }
};

const safeDeletePattern = async (pattern) => {
    try {
        if (!redisClient.isReady) return;

        const keys = await redisClient.keys(pattern);
        for (const key of keys) {
            await redisClient.del(key);
        }
    } catch (err) {
        structuredLogger.warn("Cache pattern delete skipped", err.message);
    }
};

module.exports = {
    safeDelete, safeDeletePattern
};