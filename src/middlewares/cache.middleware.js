const redisClient = require("../config/redis");
const rediClient = require("../config/redis");


const cache = (keyBuilder, ttl = 60) => {
    return async (req, res, next) => {
        try {
            if (!rediClient.isReady) {
                return next();
            }
            const key = keyBuilder(req);

            const cachedData = await redisClient.get(key);

            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }

            const originalJson = res.json.bind(res);

            res.json = async (data) => {
                try {

                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        await redisClient.setEx(
                            key,
                            ttl,
                            JSON.stringify(data)
                        );
                    }
                }
                catch (err) {
                    console.warn("Cache error:", err);
                }
                return originalJson(data);
            };
            next();
        } catch (err) {
            console.warn("Cache middleware error", err);
            next();
        }
    };
};

module.exports = cache;