
const mongoose = require('mongoose');
const wallet = require('../models/wallet');


class AdminServices {
    constructor(userRepository, walletRepository, tokenTransactionRepository) {
        this.userRepository = userRepository,
            this.walletRepository = walletRepository,
            this.tokenTransactionRepository = tokenTransactionRepository
    }

    async getAllUsersForAdmin(query) {
        const { sortBy, page, limit, search, order } = query;
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const searchQuery = search;
        const filter = {};

        if (searchQuery) {
            filter.name = { $regex: searchQuery, $options: 'i' }
        };

        const totalUsers = await this.userRepository.findCountDocs(filter);

        const totalPages = Math.ceil(totalUsers / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;
        const sortField = sortBy || 'createdAt';
        const sortOrder = order === 'desc' ? -1 : 1;

        const users = await this.userRepository.findAll(page, limit, skip, sortField, sortOrder, filter);

        return {
            data: users,

            meta: {
                page: pageNum,
                limit: limitNum,
                totalUsers,
                totalPages,
                hasNextPage,
                hasPrevPage,
            }

        }
    };

    async getUsersByIdForAdmin(id) {
        const userById = await this.userRepository.findById(id);
        if (!userById) {
            throw new Error("USER_NOT_FOUND");
        }
        return userById;
    };

    async getUserWalletDetails(id, pageNum, limitNum) {
        const user = await this.userRepository.findByIdAdmin(id);
        if (!user) throw new Error("USER_NOT_FOUND");

        const walletDoc = await this.walletRepository.findByUserId(id);
        const wallet = {
            balance: walletDoc?.balance ?? 0
        }

        const page = Number(pageNum) || 1;
        const limit = Number(limitNum) || 10;
        const skip = (page - 1) * limit;

        const transactions = await this.tokenTransactionRepository.findByUserId(id, { page, limit, skip });

        return {
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isActive: user.isActive
                },
                wallet,
                transactions
            },
            meta: {
                page,
                limit
            }
        };
    }

    async updateUserStatus(id, isActive) {
        if (typeof isActive !== 'boolean') {
            throw new Error("isActive must be true or false");
        }
        const currentStatus = await this.userRepository.findByIdAdmin(id);
        if (currentStatus.isActive === isActive) {
            throw new Error('CURRENT_STATUS_IS_SAME');
        }

        const user = await this.userRepository.updateStatusByAdmin(id, isActive);
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        return user;
    }

    async adjustWalletBalance(userId, amount, type, reason) {
        if (type !== 'DEBIT' && type !== 'CREDIT') {
            throw new Error("Type must be credit or debit");
        }
        if (!amount > 0) throw new Error("AMOUNT_SHOULDBE_GREATER_THAN_ZERO");

        const user = await this.userRepository.findByIdAdmin(userId);

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        const session = await mongoose.startSession();

        try {

            session.startTransaction();
            let updatedWallet;

            if (type === "CREDIT") {
                updatedWallet = await this.walletRepository.creditBalance(userId, amount, session);

            }
            else if (type === "DEBIT") {
                updatedWallet = await this.walletRepository.debitBalance(userId, amount, session);
            }

            if (updatedWallet === null) throw new Error("INSUFFICIENT_BALANCE");

            const transactionInfo = await this.tokenTransactionRepository.createTransaction({
                user: userId,
                type,
                amount,
                reason,
                source: 'admin'
            },
                session
            );
            await session.commitTransaction();
            console.log('user:', user);

            return {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isActive: user.isActive
                },
                updatedWallet,
                transactionInfo
            }

        } catch (err) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            throw err;
        }
        finally {
            session.endSession();
        }
    };

    async getWalletSummaryForAdmin(queryDate) {

        const date = new Date(queryDate);
        console.log(date);

        const startOfDay = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            0, 0, 0, 0
        ));

        const endOfDay = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            23, 59, 59, 999
        ));

        const walletDoc = await this.tokenTransactionRepository.transactionSummary(startOfDay, endOfDay);
        const creditAmount = walletDoc.CREDIT.totalAmount;
        console.log(creditAmount);
        const debitAmount = walletDoc.DEBIT.totalAmount;
        console.log(debitAmount);

        const netAmount = creditAmount - debitAmount;

        console.log("wallet documents:", walletDoc);
        return {
            data: walletDoc,
            meta: {
                Date: date,
                netAmount
            }

        };
    }
};



module.exports = AdminServices;