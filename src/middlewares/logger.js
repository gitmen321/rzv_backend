const strucLogger = require('../utils/structured-logger');

function logger(req, res, next) {
    strucLogger.info(`Route Hit-> ${req.method} ${req.url}`);
    next();
}

module.exports = logger;