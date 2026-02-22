const { createClient} = require('redis');

const redisClient = createClient({
    url: 'redis://127.0.0.1:6379',

    socket: {
        reconnectStrategy: false
    }
});

redisClient.on('error', (err) => {
    console.warn('Redis error:', err.message);
});


module.exports = redisClient;