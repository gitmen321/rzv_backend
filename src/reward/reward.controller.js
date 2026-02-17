const RewardServices = require('./reward.service');
const WalletRepository = require('../repositories/wallet.repository');
const TokenTransactionRepository = require('../repositories/tokenTransaction.repository');

const walletRepository = new WalletRepository();
const tokenTransactionRepository = new TokenTransactionRepository();

const rewardServices = new RewardServices(walletRepository, tokenTransactionRepository);

exports.claimDailyReward = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await rewardServices.dailyReward(user);

        res.status(200).json(result);
    } catch (err) {
        console.error('error:', err);
        next(err);
    }
}
