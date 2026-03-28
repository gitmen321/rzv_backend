const RefreshToken = require('../models/RefreshToken');
const structuredLogger = require('../utils/structured-logger');

require('../models/User');


class RefreshTokenRepository {
    
    async create({ userId, token, expiresAt }, session = null) {
        try {
            const [newSource] = await RefreshToken.create(
                [{
                user: userId,
                token: token,
                expiresAt: expiresAt
            }],
            {session}
        );

        return newSource;

        } catch (err) {
            structuredLogger.error('error:', err);
            throw err;
        }
    }

    async validToken(token) {

        return await RefreshToken.findOne({
            token: token,
            expiresAt: { $gt: new Date() }
        }).populate('user');
    };

    async revokeToken(token) {
        return await RefreshToken.updateOne(
            { token: token },
            { $set: { revoked: true } }
        );
    };

    async revokeAllByUser(userId) {
        return await RefreshToken.updateMany(
            { user: userId, revoked: false },
            { $set: { revoked: true } }
        );

    };
}

module.exports = RefreshTokenRepository;