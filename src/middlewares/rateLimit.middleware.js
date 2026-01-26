
const ms = require('ms');
const WINDOW_DURATION = ms('1m');
const MAX_REQUESTS = 100;

const rateLimitStore = new Map();

const isRateLimited = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    const ipInfo = rateLimitStore.get(ip);

    if (!ipInfo || now > ipInfo.resetTime) {
        rateLimitStore.set(ip, {
            count: 1,
            resetTime: now + WINDOW_DURATION
        });
        next();
    }

    if (ipInfo.count >= MAX_REQUESTS) {
        return res.status(429).json({
            message: "TOO_MANY_REQUESTS",
            retryAfter: Math.ceil((ipInfo.resetTime - now) / 1000),
        });
    }

    ipInfo.count + 1;
    return next();
}

module.exports = isRateLimited;