const AuthRepository = require('../repositories/auth.repository');
const WalletRepository = require('../repositories/wallet.repository');
const TokenTransactionRepository = require('../repositories/tokenTransaction.repository');

const AuthServices = require('./auth.service');
const RewardServices = require('../reward/reward.service');

const authRepository = new AuthRepository();
const walletRepository = new WalletRepository();
const tokenTransaction = new TokenTransactionRepository();

const rewardServices = new RewardServices(walletRepository, tokenTransaction);
const authServices = new AuthServices(authRepository, rewardServices);

exports.loginValidation = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        const loginUser = await authServices.loginService(email, password);
        res.status(200).json({
            message: "login successful",
            User: loginUser
        });

    } catch (err) {

        next(err);

    };

};


