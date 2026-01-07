
// Encapsulation: keeping data + logic together, and hiding internal state, eg: repository is inside the user services, controll cannot access it, can't call repository directly


class UserServices {

    constructor(userRepository) {
        this.userRepository = userRepository;
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

        const totalUsers = await this.userRepository.findCountDocs(filter);
        console.log('Totalusers:', totalUsers);


        const totalPages = Math.ceil(totalUsers / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;

        const sortField = sortBy || 'createdAt';
        const sortOrder = order === 'desc' ? -1 : 1;


        const users = await this.userRepository.findAll(page, limit, skip, sortField, sortOrder, filter); //abstraction: easy to change DB, easy to test, easy to scale



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
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        return user;
    };

    async getUserByName(name) {
        const user = await this.userRepository.findByName(name);

        if (!user) {
            throw new Error("USER_NAME_NOT_FOUND");
        }
        return user;
    }



    async createUser(newUser) {
        const { name, age, email, password } = newUser;

        // const existingUser = await this.userRepository.findByNameAndAge(name, age);
        const existingEmail = await this.userRepository.findByEmail(email);


        if (existingEmail) {
            throw new Error("EMAIL_ALREADY_EXISTS");

        }
        return await this.userRepository.create({ name, age, email, password });
    };



    async updateUser(id, updatedData) {

        delete updatedData.email;
        delete updatedData.password;
        const updatedUser = await this.userRepository.update(id, updatedData);

        if (!updatedUser) {
            throw new Error("USER_NOT_FOUND");
        }
        return updatedUser;
    };

    async deleteUser(id) {
        const user = await this.userRepository.remove(id);

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        return user;
    };

    async countUser() {
        return await this.userRepository.findCountDocs({});
    }

    

}
module.exports = UserServices;  