const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { generateAccesToken, generateRefreshToken } = require('../utils/token');
const RefreshTokenRepository = require('../repositories/refreshToken.repository');
const auditLogs = require('../audit/audit.helper');
const sendEmail = require('../utils/sendEmail');

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

    async forgotPassword(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("USER_NOT_FOUND");

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

        await sendEmail({
            to: user.email,
            subject: "Reset Your Password",
            html: `
            <h2>Password Reset request</h2>
            <p>Click the link below to reset your password</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link expires in 15 minutes.</p>
            `
        });
        return { email: user.email, resetLink };

    }

    async resetPassword(token, newPassword) {

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await this.userRepository.userByToken(hashedToken);
        console.log("username;", user.name);
        if (!user) {
            throw new Error("TOKEN_INVALID_OR_EXPIRED");
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        console.log("Password updated successfully..", user.password);
        return user;
    }

};

module.exports = AuthServices;
