


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
                meta: {
                    page: pageNum,
                    limit: limitNum,
                    totalUsers,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                }
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
                user,
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
};



module.exports = AdminServices;