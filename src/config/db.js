const mongoose = require('mongoose');
const structLogger = require('../utils/structured-logger');

let disconnectTimer;

const connectDB = async () => {
    try {

        const mongoURI =
            process.env.NODE_ENV === "test"
                ? process.env.MONGO_TEST_URI
                : process.env.MONGO_URI;


        await mongoose.connect(mongoURI);
        structLogger.info("MongoDB connected successfully");

        mongoose.connection.on("error", (err) => {
            structLogger.error({ err }, "MongoDB runtime connection error");
        });

        mongoose.connection.on("Disconnected", () => {
            structLogger.warn("MongoDB disconnected");

            disconnectTimer = setTimeout(() => {
                structLogger.error("MongoDB not reconnected in time. shutting down.");
                process.exit(1);
            }, 15000);
        });

        mongoose.connection.on("reconnected", () => {
            structLogger.info("MongoDB reconnected");

            if (disconnectTimer) {
                clearTimeout(disconnectTimer);
                disconnectTimer = null;
            }
        });

    } catch (error) {
        structLogger.error(error, 'mongodb connection failed..');
    }

};

module.exports = connectDB;


