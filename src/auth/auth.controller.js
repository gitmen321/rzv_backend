const AuthRepository = require('../repositories/auth.repository');
const WalletRepository = require('../repositories/wallet.repository');
const TokenTransactionRepository = require('../repositories/tokenTransaction.repository');
const UserRepository = require('../repositories/user.repositories');

const AuthServices = require('./auth.service');
const RewardServices = require('../reward/reward.service');
const { response } = require('express');

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

        const loginUser = await authServices.loginService(email, password, ip, userAgent);

        res.status(200).json({
            message: "login successful",
            user: loginUser
        });

    } catch (err) {
        console.error('error:', err);
        next(err);
    };

};

exports.refreshToken = async (req, res, next) => {
    try {
        const tokens = await authServices.refreshToken(req.refreshToken);

        if (req.cookies?.refreshToken) {
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 1000
            });
            return res.status(200).json({
                message: "TOKEN_REFRESHED",
                accessToken: tokens.accessToken
            });
        }

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

        const response = {
            message: "Verification Email sent to your Email Address. Please verify your email to activate your account",
            email: registeredUser.newEmail
        };
        if (process.env.EXPOSE_VERIFY_TOKEN === "true") {
            response.verifyToken = registeredUser.rawToken
        }
        res.status(201).json(response);

    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const id = req.user.id;
        const role = req.user.role;

        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

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
        await authServices.resetPassword(token, newPassword);

        res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (err) {
        next(err);
    }
}

exports.verifyEmail = async (req, res, next) => {
    try {
        const token = req.params.token;
        await authServices.verifyEmail(token);

        return res.status(200).json({
            message: "Email verified successfully",
        });

    } catch (err) {
        next(err);
    }
}

exports.resendVerifyEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authServices.resendVerifyEmail(email);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}






