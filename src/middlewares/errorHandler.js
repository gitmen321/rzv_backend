const erroHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.message == "INVALID_REFRESH_TOKEN") {
        return res.status(400).json({
            message: err.message
        });
    }
    if (err.message == "CURRENT_STATUS_IS_SAME") {
        res.status(409).json({
            message: err.message
        });
    }

    if (err.message === "isActive must be true or false") {
        return res.status(400).json({
            message: err.message
        });
    }
    if (err.message === "Type must be credit or debit") {
        return res.status(400).json({
            message: err.message
        });
    }
    if (err.message === "AMOUNT_SHOULDBE_GREATER_THAN_ZERO") {
        return res.status(400).json({
            message: err.message
        });
    }
    if (err.message === "INSUFFICIENT_BALANCE") {
        return res.status(400).json({
            message: err.message
        });
    }



    if (err.message == "USER_NOT_EXISTED") {
        return res.status(400).json({
            message: err.message
        });
    }

    if (err.name == "ValidationError") {
        return res.status(400).json({
            message: err.message
        });


    }
    if (err.message == "INACTIVE_USER") {
        return res.status(403).json({
            message: err.message
        });
    };

    if (err.message == "INVALID_CREDENTIALS") {
        return res.status(400).json({
            message: err.message
        });

    }


    if (err.name === "DB_ERROR" || err.name === "MongooseError" || err.name === " MongoError") {
        return res.status(503).json({
            message: "Database temporary unavailable"
        });
    }

    // invalid json body
    if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
        return res.status(400).json({
            message: 'Invalid Json body'
        });
    }




    switch (err.message) {
        case "USER_NOT_FOUND":
            return res.status(404).json({
                message: "User not found"
            });
        case "EMAIL_ALREADY_REGISTERED":
            return res.status(409).json({
                message: "Email already exists"
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