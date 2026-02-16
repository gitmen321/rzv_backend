
const redisClient = require('../config/redis');

const rateLimit = ({
    windowSeconds,
    maxRequests,
    keyPrefix = "RL"
}) => {
    return async (req, res, next) => {
        try {

            if (process.env.NODE_ENV === "test") return next(); //for integration testing

            const identifier = req.user?.id || req.ip;
            const redisKey = `${keyPrefix}:${identifier}`;
            const currentCount = await redisClient.incr(redisKey);

            if (currentCount === 1) {
                await redisClient.expire(redisKey, windowSeconds);
            }

            if (currentCount > maxRequests) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests, Please try again later"
                });
            }
            next();

        } catch (err) {
            console.error("RateLimiting error:", err);
            next(err);
        }
    }
}

module.exports = rateLimit;