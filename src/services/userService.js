const userRepository = require('../repositories/user.repositories');

const getAllUsers = async (page, limit, sortBy, order) => {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const skip = (pageNum - 1) * limitNum;

    const totalUsers = await userRepository.findCountDocs();
    console.log('Totalusers:', totalUsers);


    const totalPages = Math.ceil(totalUsers / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'desc' ? -1 : 1;


    const users = await userRepository.findAll(page, limit, skip, sortField, sortOrder);

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

const getUserById = async (id) => {
    const user = await userRepository.findById(id);

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    return user;
};

const getUserByName = async (name) => {
    const user = await userRepository.findByName(name);

    if (!user) {
        throw new Error("USER_NAME_NOT_FOUND");
    }
    return user;
}



const createUser = async (newUser) => {
    const { name, age } = newUser;

    const existingUser = await userRepository.findByNameAndAge(name, age);

    if (existingUser) {
        throw new Error("USER_ALREADY_EXISTS");

    }
    return await userRepository.create({ name, age });
};



const updateUser = async (id, updatedData) => {
    const updatedUser = await userRepository.update(id, updatedData);

    if (!updatedUser) {
        throw new Error("USER_NOT_FOUND");
    }
    return updatedUser;
};

const deleteUser = async (id) => {
    const deleted = await userRepository.remove(id);

    if (!deleted) {
        throw new Error("USER_NOT_FOUND");
    }
    return deleted;
};

const countUser = async () => {
    return await userRepository.count();
};


module.exports = {
    getAllUsers, getUserById, createUser, updateUser, deleteUser, countUser, getUserByName
};