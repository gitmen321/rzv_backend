const e = require('express');
const { REWARD_AMOUNTS, REWARD_REASON } = require('../constants/reward.constants');
const mongoose = require('mongoose');

class RewardServices {
    constructor(walletRepository, tokenTransactionRepository) {
        this.walletRepository = walletRepository,
            this.tokenTransactionRepository = tokenTransactionRepository
    }

    async dailyLoginReward(user) {

        const userId = user.id;
        const amount = REWARD_AMOUNTS.DAILY_LOGIN;
        const reason = REWARD_REASON.DAILY_LOGIN;

        const session = await mongoose.startSession();

        try {

            session.startTransaction();

            const isRewarded = await this.tokenTransactionRepository.findTodayReward(userId, reason, session);

            if (isRewarded) {
                console.log('kkkALREADY_REWARDED_TODAY');
                throw new Error("ALREADY_REWARDED_TODAY");

            }


            await this.walletRepository.incrementBalance(userId, amount, session);
            await this.tokenTransactionRepository.createTransaction({
                user: userId,
                type: 'earn',
                amount,
                reason,
                source: 'reward'
            },
                session
            );

            await session.commitTransaction();
            console.log('rewardservice is succefully calling');
            return {
                amount, reason, message: "Daily login reward granted"
            };
        } catch (err) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }

            if (err.message === 'ALREADY_REWARDED_TODAY') {
                return;
            }
            throw err;
        } finally {
            session.endSession();
        }

    }
}

module.exports = RewardServices;