const erroHandler = (err, req, res, next) => {
    console.error(err.stack);



    if (err.name === "DB_ERROR" || err.name === "MongooseError" || err.name === " MongoError") {
        return res.status(503).json({
            message: "Database temporary unavailable"
        });
    }

    switch (err.message) {
        case "USER_NOT_FOUND":
            return res.status(404).json({
                message: "User not found"
            });
        case "USER_ALREADY_EXISTS":
            return res.status(409).json({
                message: "User already exists"
            });
        case "USER_NAME_NOT_FOUND":
            return res.status(404).json({
                message: "User name not found"
            });

        default:
            res.status(500).json({
                message: "Internal Server Error"
            });
    }
};

module.exports = erroHandler;