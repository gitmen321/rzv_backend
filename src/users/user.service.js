
// Encapsulation: keeping data + logic together, and hiding internal state, eg: repository is inside the user services, controll cannot access it, can't call repository directly



const mongoose = require('mongoose');


class UserServices {

    constructor(userRepository, walletRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
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

        const totalUsers = await this.userRepository.findActiveUsersCount(filter);
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

        const existingEmail = await this.userRepository.findByEmail(email);


        if (existingEmail) {
            throw new Error("EMAIL_ALREADY_REGISTERED");

        }

        const session = await mongoose.startSession();
        try{
                session.startTransaction();
        

        const createdUser = await this.userRepository.create({ name, age, email, password },
            session,
        );
        
        await this.walletRepository.createWallet(createdUser.id, 0, session);
        
        await session.commitTransaction();
        return createdUser;
    } catch (err) {
        await session.abortTransaction();
        throw(err);
    }
    finally{
        await session.endSession();
    }
}




    async updateUser(id, updatedData) {

        delete updatedData.email;
        delete updatedData.password;
        const updatedUser = await this.userRepository.update(id, updatedData);
        console.log('updated user:', updatedUser);

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