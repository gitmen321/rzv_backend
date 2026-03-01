const connectDB = require('./src/config/db');
const redisClient = require('./src/config/redis');
const app = require('./src/app');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
require("./src/infrastructure/cache/cache.listener");

const PORT = process.env.PORT || 3000;



async function startServer() {
    try {
        if (process.env.NODE_ENV !== "test") {


            redisClient.connect()
                .then(() => console.log('Redis connescted'))
                .catch((err) =>
                    console.warn('Redis connection failed, continue without redis:', err.message)
                );

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
