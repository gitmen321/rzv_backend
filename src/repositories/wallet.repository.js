const wallet = require('../models/wallet');
const Wallet = require('../models/wallet');
const mongoose = require('mongoose');

class WalletRepository {

    async createWallet(userId, balance, session = null) {
        return Wallet.create(
            [
                {
                    user: new mongoose.Types.ObjectId(userId),
                    balance
                }
            ],
            { session, }
        );

    };

    async getTotalbalance() {
        const result = await wallet.aggregate([
            {
                $group: {
                    _id: null,
                    totalBalance: { $sum: "balance" }
                }
            }
        ]);

        const totalBalance = result.length > 0 ? result[0].totalBalance : 0;
        return totalBalance;
    }

    async findByUserId(userId, session = null) {
        let query = Wallet.findOne({ user: userId });

        if (session) {
            query = query.session(session);
        }
        return query;
    };


    async incrementBalance(userId, amount, session = null) {
        console.log('increment method calling', userId);
        return Wallet.findOneAndUpdate(
            { user: userId },
            { $inc: { balance: amount } },

            {
                new: true,
                session
            }
        );
    }

    async creditBalance(userId, amount, session = null) {

        return this.incrementBalance(userId, amount, session);

    }

    async debitBalance(userId, amount, session = null) {
        return Wallet.findOneAndUpdate(
            {
                user: userId,
                balance: { $gte: amount }
            },
            {
                $inc: { balance: -amount }
            },
            {
                new: true,
                session
            }
        );
    };
}

module.exports = WalletRepository;

