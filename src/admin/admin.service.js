

class AdminServices {
    constructor(userRepository) {
        this.userRepository = userRepository
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
        if (!userById ) {
            throw new Error("USER_NOT_FOUND");
        }
        return userById;
    };

    async updateUserStatus(id, isACtive) {
        const user = await this.userRepository.updateStatusByAdmin(id, isACtive);
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        return user;
    }
};



module.exports = AdminServices;