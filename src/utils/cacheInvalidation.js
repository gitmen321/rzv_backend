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

        let cursor = '0';

        do {
            const reply = await redisClient.scan(cursor, {
                MATCH: pattern,
                COUNT: 100
            });

            cursor = reply.cursor;
            const keys = reply.keys;

            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        }   while (cursor !== '0');
      
        }
     catch (err) {
        structuredLogger.warn("Cache pattern delete failed", err.message);
    }
};

module.exports = {
    safeDelete, safeDeletePattern
};