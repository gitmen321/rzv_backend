const TokenTransaction = require('../models/TokenTransaction');

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

        return TokenTransaction.findOne(
            {
                user: userId,
                reason,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            },
            null,
            { session }
        );
    }

    async findByUserId(userId, { page, limit, skip }, session = null) {
        let query = TokenTransaction.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (session) {
            query = query.session(session);
        }
        return query;
    }


    async createTransaction(data, session = null) {
        const transaction = new TokenTransaction(data);
        return transaction.save({ session });
    }

    async transactionSummary(startOfDay, endOfDay, session = null) {
        const result = await TokenTransaction.aggregate([

            {
                $match: {
                    createdAt: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            },

            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" },
                    transactionCount: { $sum: 1 }
                }
            }
        ]).session(session);

        const summary = {
            CREDIT: { totalAmount: 0, count: 0 },
            DEBIT: { totalAmount: 0, count: 0 },
        };

        for (const row of result) {
            summary[row._id] = {
                totalAmount: row.totalAmount,
                count: row.transactionCount
            };
        }

        return summary;
    }

}
module.exports = TokenTransactionRepository;
