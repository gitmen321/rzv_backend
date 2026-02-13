
// Encapsulation: keeping data + logic together, and hiding internal state, eg: repository is inside the user services, controll cannot access it, can't call repository directly
const _ = require('lodash');
const rewardReason = require("../constants/reward.constants");

class UserServices {

    constructor(userRepository, walletRepository, refreshTokenRepository, tokenTransactionRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.refreshTokenRepository = refreshTokenRepository,
            this.tokenTransactionRepository = tokenTransactionRepository
    }


    async getUserById(id) {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        return {
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };
    };


    async updateUser(id, updatedData) {

        delete updatedData.email;
        delete updatedData.password;

        const allowedFiels = ["name", "age"];
        const filtered = _.pick(updatedData, allowedFiels);

        const updatedUser = await this.userRepository.update(id, filtered);
        console.log('updated user:', updatedUser);

        if (!updatedUser) {
            throw new Error("USER_NOT_FOUND");
        }
        return updatedUser;
    };

    async getWalletDetails(id) {
        const userWalletData = await this.walletRepository.findByUserId(id);
        console.log("userWalletData:", userWalletData);

        if (!userWalletData) throw new Error("WALLET_NOT_EXISTED");

        return {
            balance: userWalletData.balance,
            lastUpdated: userWalletData.updatedAt
        };
    }

    async getTransactionSummary(id, page, limit, start, end) {

        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        let startOfDate = null;
        let endOfDate = null;

        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            startOfDate = new Date(Date.UTC(
                startDate.getUTCFullYear(),
                startDate.getUTCMonth(),
                startDate.getUTCDate(),
                0, 0, 0, 0
            ));

            endOfDate = new Date(Date.UTC(
                endDate.getUTCFullYear(),
                endDate.getUTCMonth(),
                endDate.getUTCDate(),
                23, 59, 59, 999
            ));
        }

        const data = await this.tokenTransactionRepository.findByUserId(id, {
            limit: limitNum,
            skip,
            startOfDate,
            endOfDate
        });

        if (!data || data.length === 0) return [];

        console.log("Transaction summary: ", data);

        return data.map(transaction => ({
            type: transaction.type,
            amount: transaction.amount,
            reason: transaction.reason,
            createdAt: transaction.createdAt
        }));
    }

    async getReferralDetails(id) {

        const reason = rewardReason.REWARD_REASON.REFERRAL;
        console.log("userId:", id, "reason:", reason);

        const data = this.tokenTransactionRepository.getReferralRewardDetails(id, reason);

        return data;
    }


    async deleteUser(id) {
        const user = await this.userRepository.remove(id);


        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        await this.refreshTokenRepository.revokeAllByUser(id)
        return user;
    };

}
module.exports = UserServices;  