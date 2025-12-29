const erroHandler = (err, req, res, next) => {
    console.error(err.stack);

    switch (err.message) {
        case "USER_NOT_FOUND":
            return res.status(404).json({
                message: "User not found"
            });
        case "USER_ALREADY_EXISTS":
            return res.status(409).json({
                message: "User already exists"
            });

        default:
            res.status(500).json({
                message: "Internal Server Error"
            });
    }
};

module.exports = erroHandler;