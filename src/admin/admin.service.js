
const mongoose = require('mongoose');
const wallet = require('../models/wallet');
import createAuditLog from "../audit/audit.helper";

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

    async updateUserStatus(id, isActive, adminId) {

        const currentStatus = await this.userRepository.findByIdAdmin(id);
        if (currentStatus.isActive === isActive) {
            throw new Error('CURRENT_STATUS_IS_SAME');
        }

        const oldValue = currentStatus.isActive;
a
        const user = await this.userRepository.updateStatusByAdmin(id, isActive);
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        await createAuditLog({
            adminId,
            action: 'USER_STATUS_UPDATE',
            targetedUserId: user.id,
            oldValue: { isActive: oldValue },
            newValue: { isActive }
        });
        return user;
    }

    async adjustWalletBalance(userId, amount, type, reason) {

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

    async getWalletSummaryInRange(start, end, page, limit) {

        const startDate = new Date(start);
        const endDate = new Date(end);
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;


        const startOfDate = new Date(Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate(),
            0, 0, 0, 0
        ));

        const endOfDate = new Date(Date.UTC(
            endDate.getUTCFullYear(),
            endDate.getUTCMonth(),
            endDate.getUTCDate(),
            23, 59, 59, 999
        ));

        const transactions = await this.tokenTransactionRepository.transactionSummaryInRange(startOfDate, endOfDate, pageNum, limitNum, skip);
        const totalRecords = await this.tokenTransactionRepository.countTransactionsInRange(startOfDate, endOfDate);

        const totalPages = Math.ceil(totalRecords / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;

        return {
            data: transactions,
            meta: {
                page: pageNum,
                limit: limitNum,
                totalRecords,
                totalPages,
                hasNextPage,
                hasPrevPage
            }
        }
    }
};



module.exports = AdminServices;