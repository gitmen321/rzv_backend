require('dotenv').config();

const connectDB = require('./src/config/db');
const redisClient = require('./src/config/redis');
const app = require('./src/app');
const PORT = process.env.PORT || 3000;


async function startServer() {
    try {
        await redisClient.connect();
        console.log('redis connected');

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
