const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL,

    socket: {
        reconnectStrategy: false
    }
});

redisClient.on('error', (err) => {
    console.warn('Redis error:', err.message);
});


module.exports = redisClient;