const AuthRepository = require('../repositories/auth.repository');
const WalletRepository = require('../repositories/wallet.repository');
const TokenTransactionRepository = require('../repositories/tokenTransaction.repository');
const UserRepository = require('../repositories/user.repositories');

const AuthServices = require('./auth.service');
const RewardServices = require('../reward/reward.service');

const authRepository = new AuthRepository();
const walletRepository = new WalletRepository();
const tokenTransaction = new TokenTransactionRepository();
const userRepository = new UserRepository();

const rewardServices = new RewardServices(walletRepository, tokenTransaction);
const authServices = new AuthServices(authRepository, rewardServices, userRepository, walletRepository);

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

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "REFRESH_TOKEN_REQUIRED",
            });
        }

        const tokens = await authServices.refreshToken(refreshToken);

        return res.status(200).json({
            message: "TOKEN_REFRESHED",
            ...tokens
        });
    } catch (err) {
        next(err);
    }
};

exports.register = async (req, res, next) => {
    const newUser = req.body;

    try {
        const registeredUser = await authServices.register(newUser);

        res.status(201).json({
            message: "Registered Successfully",
            user: registeredUser
        });

    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const id = req.user;
        await authServices.logout(id);

        return res.status(200).json({
            message: "USER_LOGGED_OUT",
            user: id
        });
    } catch (err) {
        next(err);
    };

}







