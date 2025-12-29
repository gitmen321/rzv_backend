const userRepository = require('../repositories/user.repositories');

const getAllUsers = () => {
    return userRepository.findAll();
};

const getUserById = (id) => {
    const user = userRepository.findById(id);

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    return user;
};



const createUser = (newUser) => {
    const { name, age } = newUser;

    const existingUser = userRepository.findByNameAndAge(name, age);

    if (existingUser) {
        throw new Error("USER_ALREADY_EXISTS");

    }
    return userRepository.create({ name, age });
};



const updateUser = (id, updatedData) => {
    const updatedUser = userRepository.update(id, updatedData);

    if (!updatedUser) {
        throw new Error("USER_NOT_FOUND");
    }
    return updatedUser;
};

const deleteUser = (id) => {
    const deleted = userRepository.remove(id);

    if (!deleted) {
        throw new Error("USER_NOT_FOUND");
    }
    return deleted;
};

const countUser = () => {
    return userRepository.count();
};


module.exports = {
    getAllUsers, getUserById, createUser, updateUser, deleteUser, countUser
};