const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { generateAccesToken, generateRefreshToken } = require('../utils/token');
const RefreshTokenRepository = require('../repositories/refreshToken.repository');
const auditLogs = require('../audit/audit.helper');

class AuthServices {
    constructor(authRepository, rewardServices, userRepository, walletRepository) {
        this.authRepository = authRepository,
            this.rewardServices = rewardServices,
            this.userRepository = userRepository,
            this.walletRepository = walletRepository
        this.refreshTokenRepository = new RefreshTokenRepository();
    }

    async loginService(email, password, ip, userAgent) {

        const user = await this.authRepository.findByEmailWithPass(email);

        if (!user || !user.isActive) throw new Error("USER_NOT_EXISTED");

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new Error("INVALID_CREDENTIALS");

        console.log('ROLE FROM DB:', user.role);

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };
        const accessToken = generateAccesToken(payload);
        const refreshTokenValue = generateRefreshToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await this.refreshTokenRepository.create({
            userId: user._id,
            token: refreshTokenValue,
            expiresAt
        });


        await this.rewardServices.dailyLoginReward(user);
        user.password = undefined;

        if (user.role == 'admin') {
            const adminId = user.id;
            console.log('yes it is admin', adminId);
            await auditLogs({
                adminId,
                action: "ADMIN_LOGIN",
                ipAddress: ip,
                userAgent: userAgent
            });
        }





        return {
            accessToken,
            refreshToken: refreshTokenValue
        };

    };

    async refreshToken(refreshTokenValue) {

        const storedToken = await this.refreshTokenRepository.validToken(refreshTokenValue);

        if (!storedToken) {
            throw new Error("INVALID_REFRESH_TOKEN");
        }

        const user = storedToken.user;

        if (!user) {
            throw new Error("USER_NOT_FOUND")
        }

        if (!user.isActive) {
            throw new Error("ACCOUNT_DISABLED");
        }

        if (storedToken.revoked) {
            await this.refreshTokenRepository.revokeAllByUser(user);
            throw new Error("TOKEN_REUSE_DETECTED");
        }

        await this.refreshTokenRepository.revokeToken(refreshTokenValue);

        const newRefreshToken = generateRefreshToken();

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);


        await this.refreshTokenRepository.create({
            userId: user._id,
            token: newRefreshToken,
            expiresAt
        });

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        const newAccessToken = generateAccesToken(payload)

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    };

    async logout(id, ip, userAgent, role) {
        try {

            const loggedOut = await this.refreshTokenRepository.revokeAllByUser(id);

            console.log('role:', role, 'id:', id);
            if (role == 'admin') {
                await auditLogs({
                    adminId: id,
                    action: 'ADMIN_LOGOUT',
                    ipAddress: ip,
                    userAgent: userAgent
                });
            }
            return loggedOut;


        } catch (err) {
            throw new Error("Logout failed", err);

        }
    }



    async register(newUser) {
        const { email, name, password } = newUser;

        const existingEmail = await this.userRepository.findByEmail(email);

        if (existingEmail) {
            throw new Error("EMAIL_ALREADY_REGISTERED");
        };

        const session = await mongoose.startSession();

        try {
            session.startTransaction();


            const newUser = await this.userRepository.create({ email, password, name }, session);

            await this.walletRepository.createWallet(newUser.id, 0, session);

            await session.commitTransaction();


            newUser.password = undefined;
            console.log('Registered user:', newUser);
            return newUser;

        } catch (err) {
            await session.abortTransaction();
            throw (err);
        }
        finally {
            await session.endSession();
        }
    };

};

module.exports = AuthServices;
