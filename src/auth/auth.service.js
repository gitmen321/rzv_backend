const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

class AuthServices {
    constructor(authRepository, rewardServices, userRepository, walletRepository) {
        this.authRepository = authRepository,
            this.rewardServices = rewardServices,
            this.userRepository = userRepository,
            this.walletRepository = walletRepository
    }

    async loginService(email, password) {


        if (!email || !password) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const user = await this.authRepository.findByEmailWithPass(email);

        if (!user) throw new Error("USER_NOT_EXISTED");

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new Error("INVALID_CREDENTIALS");

        console.log('ROLE FROM DB:', user.role);

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,

            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        await this.rewardServices.dailyLoginReward(user);

        user.password = undefined;

        return {
            token,
            user

        };
    };
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
    }
};

module.exports = AuthServices;
