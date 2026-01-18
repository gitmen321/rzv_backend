const TokenTransaction = require('../models/TokenTransaction');
const mongoose = require('mongoose');

class TokenTransactionRepository {

    async findTodayReward(userId, reason, session = null) {
        const now = new Date();

        const startOfDay = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            0, 0, 0, 0
        ));

        const endOfDay = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            23, 59, 59, 999
        ));

        return  TokenTransaction.findOne(
            {
                user: userId,
                reason,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            },
            null,
            { session }
        );
    }
    async createTransaction(data, session = null) {
        const transaction = new TokenTransaction(data);
        return  transaction.save({ session });
    }
}
module.exports = TokenTransactionRepository;
