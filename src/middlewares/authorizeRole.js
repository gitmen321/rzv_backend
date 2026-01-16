
const { AUTH_ERRORS } = require('../constants/auth.constants');

const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                message: AUTH_ERRORS.UNAUTHORIZED
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: AUTH_ERRORS.FORBIDDEN
            });
        }
        next();
    };
};

module.exports = authorizeRole;