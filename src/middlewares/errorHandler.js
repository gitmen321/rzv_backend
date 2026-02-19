const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    console.log("Error Handler Triggered");
    console.log("HEADERS SENT?", res.headersSent);

    if (res.headersSent) {
        return next(err);
    }

    // 1. Handle specific Library/System errors first
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
    }

    if (["DB_ERROR", "MongooseError", "MongoError"].includes(err.name)) {
        return res.status(503).json({ message: "Database temporary unavailable" });
    }

    if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Invalid Json body' });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "EMAIL_ALREADY_REGISTERED"
        });
    }

    // 2. Map your custom error messages to status codes
    const errorMap = {
        "EMAIL_ALREADY_VERIFIED": 409,
        "INVALID_REFRESH_TOKEN": 401,
        "ADMIN_REGISTRATION_DIABLED": 400,
        "USER_NOT_EXISTED": 400,
        "INVALID_CREDENTIALS": 401,
        "INACTIVE_USER": 403,
        "USER_NOT_FOUND": 404,
        "USER_NAME_NOT_FOUND": 404,
        "USER_NOT_EXISTED_OR_VERIFIED": 403,
        "CURRENT_STATUS_IS_SAME": 409,
        "INSUFFICIENT_BALANCE": 409,
        "EMAIL_ALREADY_REGISTERED": 409,
        "EMAIL_NOT_VERIFIED_RESENT": 400,
        "WALLET_NOT_EXISTED": 400,
        "TRANSACTIONS_NOT_EXISTED": 400,
        "REFERRAL_CODE_IS_NOT_VALID": 400,
        "ALREADY_REWARDED_TODAY": 409,
        "NOT_POSSIBLE": 400
    };

    const statusCode = errorMap[err.message] || err.statusCode || 500;
    const message = statusCode === 500 ? "Internal Server Error" : err.message;

    // 3. Single point of return
    return res.status(statusCode).json({
        success: false,
        message: message
    });
};

module.exports = errorHandler;