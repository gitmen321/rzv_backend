
// Encapsulation: keeping data + logic together, and hiding internal state, eg: repository is inside the user services, controll cannot access it, can't call repository directly


class UserServices {

    constructor(repository) {
        this.repository = repository;
    }



    async getAllUsers(page, limit, sortBy, order, search) {
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        const skip = (pageNum - 1) * limitNum;

        const searchQuery = search;
        const filter = {};

        if (searchQuery) {
            filter.name = { $regex: searchQuery, $options: 'i' }
        };

        const totalUsers = await this.repository.findCountDocs(filter);
        console.log('Totalusers:', totalUsers);


        const totalPages = Math.ceil(totalUsers / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;

        const sortField = sortBy || 'createdAt';
        const sortOrder = order === 'desc' ? -1 : 1;


        const users = await this.repository.findAll(page, limit, skip, sortField, sortOrder, filter); //abstraction: easy to change DB, easy to test, easy to scale



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
    }

    async getUserById(id) {
        const user = await this.repository.findById(id);

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        return user;
    };

    async getUserByName(name) {
        const user = await this.repository.findByName(name);

        if (!user) {
            throw new Error("USER_NAME_NOT_FOUND");
        }
        return user;
    }



    async createUser(newUser) {
        const { name, age } = newUser;

        const existingUser = await this.repository.findByNameAndAge(name, age);

        if (existingUser) {
            throw new Error("USER_ALREADY_EXISTS");

        }
        return await this.repository.create({ name, age });
    };



    async updateUser(id, updatedData) {
        const updatedUser = await this.repository.update(id, updatedData);

        if (!updatedUser) {
            throw new Error("USER_NOT_FOUND");
        }
        return updatedUser;
    };

    async deleteUser(id) {
        const deleted = await this.repository.remove(id);

        if (!deleted) {
            throw new Error("USER_NOT_FOUND");
        }
        return deleted;
    };

    async countUser() {
        return await this.repository.findCountDocs();
    }

    // const countUser = async () => {
    //     return await userRepository.count();
    // };

}
module.exports = UserServices;