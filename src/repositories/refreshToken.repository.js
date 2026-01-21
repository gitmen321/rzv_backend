const RefreshToken = require('../models/RefreshToken');
require('../models/User');
class RefreshTokenRepository {
    async create({ userId, token, expiresAt }, session = null) {
        try {
            const refreshTokenSchema = new RefreshToken({
                user: userId,
                token: token,
                expiresAt: expiresAt
            });

            return await refreshTokenSchema.save();

        } catch (err) {
            console.log('error:', err);
            throw err;
        }
    }

    async validToken(token) {

        return await RefreshToken.findOne({
            token: token,
            revoked: false,
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