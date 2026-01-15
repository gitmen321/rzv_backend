
const { AUTH_ERRORS } = require('../constants/auth.constants');

const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message: AUTH_ERRORS.FORBIDDEN
                });
            }
            next();
        }
        catch (err) {
            console.log(err);
            return res.status(403).json({
                message: AUTH_ERRORS.FORBIDDEN
            });

        }
    };
};

module.exports = authorizeRole;