const { REWARD_AMOUNTS, REWARD_REASON } = require('../constants/reward.constants');
const mongoose = require('mongoose');
const eventBus = require("../core/eventBus");

class RewardServices {
    constructor(walletRepository, tokenTransactionRepository) {
        this.walletRepository = walletRepository,
            this.tokenTransactionRepository = tokenTransactionRepository
    }

    async dailyReward(user) {
        const userId = user.id;
        const amount = REWARD_AMOUNTS.DAILY_LOGIN;
        const reason = REWARD_REASON.DAILY_LOGIN;
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const isRewarded = await this.tokenTransactionRepository.findTodayReward(userId, reason, session);
            if (isRewarded) {
                throw new Error("ALREADY_REWARDED_TODAY");
            }
            await this.walletRepository.incrementBalance(userId, amount, session);
            await this.tokenTransactionRepository.createTransaction({
                user: userId,
                type: 'CREDIT',
                amount,
                reason,
                sources: 'reward'
            },
                session
            );

            await session.commitTransaction();
            
            eventBus.emit("WALLET_UPDATED", {
                userId,
                amount
            });
            return {
                amount, reason, message: "Daily login reward granted"
            };
        } catch (err) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }

            if (err.message === 'ALREADY_REWARDED_TODAY') {
                throw err;
            }
            throw err;
        } finally {
            session.endSession();
        }

    }

    async registerByReferReward(user, externalSession = null) {
        const userId = user.id;
        const amount = REWARD_AMOUNTS.REFERRED;
        const reason = REWARD_REASON.REFERRED;

        const session = externalSession || await mongoose.startSession();
        const isLocalSession = !externalSession;

        if (isLocalSession) session.startTransaction();

        try {

            await this.walletRepository.incrementBalance(userId, amount, session);
            await this.tokenTransactionRepository.createTransaction({
                user: userId,
                type: 'CREDIT',
                amount,
                reason,
                source: 'reward'
            }, session
            );

            if (isLocalSession) await session.commitTransaction();


            return {
                amount, reason, message: "REFERRAL_REWARD_GRANTED"
            }

        } catch (err) {
            if (isLocalSession && session.inTransaction()) {
                await session.abortTransaction();
            }
            throw err;
        } finally {
            if (isLocalSession) session.endSession();
        }
    }

    async referralReward(user, externalSession = null) {
        const userId = user.id;
        const amount = REWARD_AMOUNTS.REFERRAL;
        const reason = REWARD_REASON.REFERRAL;


        const session = externalSession || await mongoose.startSession();
        const isLocalSession = !externalSession;

        if (isLocalSession) session.startTransaction();

        try {
            await this.walletRepository.incrementBalance(userId, amount, session);

            await this.tokenTransactionRepository.createTransaction({
                user: userId,
                type: 'CREDIT',
                amount,
                reason,
                source: 'reward'
            }, session
            );

            if (isLocalSession) await session.commitTransaction();


            return {
                amount, reason, message: "REFERRAL_REWARD_GRANTED"
            }



        } catch (err) {
            if (isLocalSession && session.inTransaction()) {
                await session.abortTransaction();
            }
            throw err;
        } finally {
            if (isLocalSession) session.endSession();
        }

    }
}

module.exports = RewardServices;