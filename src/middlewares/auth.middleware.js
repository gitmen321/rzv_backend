const jwt = require('jsonwebtoken');
const { AUTH_ERRORS } = require('../constants/auth.constants');
const UserRespository = require('../repositories/user.repositories');

const userRepository = new UserRespository();

const isAuthenticated = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) return res.status(401).json({
            message: AUTH_ERRORS.UNAUTHORIZED
        });

        if (!authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                message: AUTH_ERRORS.UNAUTHORIZED
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userRepository.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                message: "USER_NOT_FOUND"
            });

        }
        if (!user.isActive) {
            return res.status(403).json({
                message: "ACCOUNT_DISABLED"
            });
        }

        req.user = user;
        console.log("requested usser:", req.user);

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: AUTH_ERRORS.UNAUTHORIZED
            });
        }

        next();

    } catch (err) {
        console.log('error is:', err);
        return res.status(401).json({
            message: AUTH_ERRORS.INVALID_TOKEN,
        });

    };

};


module.exports = isAuthenticated;