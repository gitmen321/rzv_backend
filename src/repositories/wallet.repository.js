const Wallet = require('../models/wallet');
const mongoose = require('mongoose');

class WalletRepository {

    async createWallet(userId, balance, session = null) {
        return  Wallet.create(
            [
                {
                    user: new mongoose.Types.ObjectId(userId),
                    balance
                }
            ],
            { session, }
        );

    }

    async incrementBalance(userId, amount, session = null) {
        console.log('increment method calling', userId);
        return  Wallet.findOneAndUpdate(
            { user: userId },
            { $inc: { balance: amount } },
            { session }
        );
    }
}

module.exports = WalletRepository;

