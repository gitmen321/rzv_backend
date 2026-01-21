const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        token: {
            type: String,
            unique: true,
            index: true
        },
        expiresAt: {
            type: Date,
            index: true
        },
        revoked: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
