require('dotenv').config();
require("./src/infrastructure/cache/cache.listener");

const connectDB = require('./src/config/db');
const redisClient = require('./src/config/redis');
const app = require('./src/app');
const PORT = process.env.PORT || 3000;



async function startServer() {
    try {
        if (process.env.NODE_ENV !== "test") {

            try {
                await redisClient.connect();
                console.log('redis connected');

            } catch (redisErr) {
                console.warn('Redis connection failed, continue without redi', redisErr.message);
            }
        }
        
        await connectDB();

        app.listen(PORT, () => {
            console.log(`SERVER STARTED ON PORT ${PORT}`);
        });
    } catch (err) {
        console.log('startup erro:', err);
        process.exit(1);
    }
}

startServer();
