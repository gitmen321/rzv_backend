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
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        console.log('ipaddress:', ip, 'userAgent', userAgent);
        const loginUser = await authServices.loginService(email, password, ip, userAgent);
        res.status(200).json({
            message: "login successful",
            User: loginUser
        });

    } catch (err) {
        console.log('error:', err);

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
            message: "Verification Email sent to your Email Address. Please verify your email to activate your account",
            email: registeredUser.email
        });

    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const id = req.user.id;
        const role = req.user.role;
        console.log('role:', role);

        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        console.log('ipaddress:', ip, 'userAgent', userAgent);

        await authServices.logout(id, ip, userAgent, role);

        return res.status(200).json({
            message: "USER_LOGGED_OUT",
            user: id
        });
    } catch (err) {
        next(err);
    };

}

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authServices.forgotPassword(email);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const token = req.params.token;
        const { newPassword } = req.body;
        const result = await authServices.resetPassword(token, newPassword);

        return res.status(200).json(result);

    } catch (err) {
        console.log('reser password error:', err);
        next(err);
    }
}

exports.verifyEmail = async (req, res, next) => {
    try {
        const token = req.params.token;
        const result = await authServices.verifyEmail(token);

        return res.status(200).json({
            message: "Registration Successful",
            ...result
        });

    } catch (err) {
        next(err);
    }
}







