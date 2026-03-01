const pino = require("pino");

const structLogger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport:
        process.env.NODE_ENV !== "production"
            ? {
                target: "pino-pretty",
                options: { colorize: true },
            }
            : undefined,
});

module.exports = structLogger;