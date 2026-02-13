const mongoose = require('mongoose')
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

    async getTodaySummary(session = null) {
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);

        const stats = await TokenTransaction.aggregate([
            {
                $match: { createdAt: { $gte: startOfDay } }
            },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" },
                    transactionCount: { $sum: 1 }
                }
            }
        ]).session(session);

        const todaySummary = {
            CREDIT: { totalAmount: 0, count: 0 },
            DEBIT: { totalAmount: 0, count: 0 },
        };

        for (const row of stats) {
            todaySummary[row._id] = {
                totalAmount: row.totalAmount,
                count: row.transactionCount
            };
        }

        return todaySummary;
    }


    async findByUserId(userId, { limit, skip, startOfDate, endOfDate }, session = null) {

        const filter = { user: userId };

        if (startOfDate || endOfDate) {
            filter.createdAt = {};

            if (startOfDate) {

                if (!isNaN(startOfDate.getTime())) filter.createdAt.$gte = startOfDate;
            }

            if (endOfDate) {
                if (!isNaN(endOfDate.getTime())) filter.createdAt.$lte = endOfDate;
            }

            if (Object.keys(filter.createdAt).length === 0) {
                delete filter.createdAt;
            }
        }

        let query = TokenTransaction.find(filter)
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

    async transactionSummaryInRange(startOfDate, endOfDate, pageNum, limitNum, skip, session = null) {
        const transactionResult = await TokenTransaction.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfDate,
                        $lte: endOfDate,
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userProfile"
                }
            },

            { $unwind: "$userProfile" },

            {
                $project: {
                    _id: 1,
                    amount: 1,
                    type: 1,
                    reason: 1,
                    source: 1,
                    createdAt: 1,
                    userName: "$userProfile.name",
                    userEmail: "$userProfile.email"
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limitNum
            }
        ]).session(session);

        return transactionResult;

    }

    async countTransactionsInRange(startOfDate, endOfDate) {

        const result = await TokenTransaction.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfDate,
                        $lte: endOfDate,
                    }
                }
            },

            {
                $count: "totalCount"
            }

        ]);
        console.log('totalrecords:', result[0].totalCount);

        return result.length > 0 ? result[0].totalCount : 0;

    }

    async getReferralRewardDetails(id, reason) {

        const userId = new mongoose.Types.ObjectId(id);
        const result = await TokenTransaction.aggregate([
            {
                $match: {
                    user: userId,
                    reason: reason
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    totalCount: { $sum: 1 }
                },
            }
        ]);
        console.log("TotalCount and amount:", result);
        return result[0] || { totalAmount: 0, totalCount: 0 };
    }

}
module.exports = TokenTransactionRepository;
