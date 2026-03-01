const { createClient } = require('redis');
const structuredLogger = require("../utils/structured-logger");


const redisClient = createClient({
    url: process.env.REDIS_URL,

    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                structuredLogger.error('Redis retry attempts exhausted.');
                return false;
            }
            return Math.min(retries * 1000, 5000);
        }
    }
});

redisClient.on('error', (err) => {
    structuredLogger.warn('Redis error:', err.message);
});


module.exports = redisClient;