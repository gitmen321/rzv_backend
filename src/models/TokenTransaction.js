const mongoose = require('mongoose');

const TokenTransactionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['CREDIT', 'DEBIT'],
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        reason: {
            type: String,
            required: true,
            trim: true
        },
        source: {
            type: String,
            enum: ['system', 'admin', 'reward'],
            default: 'system'
        }

    },
    {
        timestamps: true
    }

);
TokenTransactionSchema.index({
    user: 1,
    reason: 1,
    createdAt: 1,
},
    {
        unique: true
    });
module.exports = mongoose.model('TokenTransaction', TokenTransactionSchema);