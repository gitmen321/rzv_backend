if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const connectDB = require('./src/config/db');
const redisClient = require('./src/config/redis');
const app = require('./src/app');
const structLogger = require('./src/utils/structured-logger');

require("./src/infrastructure/cache/cache.listener");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        if (process.env.NODE_ENV !== "test") {


            redisClient.connect()
                .then(() => structLogger.info('Redis connescted'))
                .catch((err) =>
                    structLogger.warn('Redis connection failed, continue without redis:', err.message)
                );
        }
        await connectDB();

        const server = app.listen(PORT, () => {
            structLogger.info(`SERVER STARTED ON PORT ${PORT}`);
        });

        process.on("SIGTERM", () => {
            structLogger.warn("SIGTERM received shutting down gracefully...")
            server.close(() => {
                structLogger.info("Process terminated");
            });
        });

    } catch (err) {
        structLogger.error('startup erro:', err);
        process.exit(1);
    }
}

startServer();

process.on("uncaughtException", (err) => {
    structLogger.fatal({ err }, "UNCAUGHT EXCEPTION - shutting down");
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    structLogger.fatal({ reason }, "UNHANDLED PROMISE REJECTION - shutting down");
    process.exit(1);
});
