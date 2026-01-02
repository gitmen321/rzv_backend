const userService = require('../services/userService');

exports.getAllUsers = async (req, res, next) => {

    try{

    const { page, limit, sortBy, order, search } = req.query;
    console.log("requested body:",req.query);
    const result = await userService.getAllUsers(page, limit, sortBy, order, search);
    console.log("Users from services", result);
    res.status(200).json(result);
    }
    catch (err) {
        console.err('error',err);
        next(err);
    }
};

exports.countUsers = async (req, res) => {
    const usersCount = await userService.countUser();
    res.status(200).json({
        message: "User count is:",
        user: usersCount,
    });
};

exports.getUserById = async (req, res, next) => {

    try {
        const id = req.params.id;
        const user = await userService.getUserById(id);
        res.status(200).json(user);
    }

    catch (error) {
        next(error);
    }
};

exports.getUserByName = async (req, res, next) => {
    try {
        const name = req.params.name;
        const user = await userService.getUserByName(name);
        console.log(user);
        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
};



exports.createUsers = async (req, res, next) => {

    try {
        const newUser = req.body;


        const cretatedUser = await userService.createUser(newUser);

        res.status(201).json({
            user: cretatedUser,
        });
    }

    catch (error) {
        next(error);

    }
};

exports.updateUsers = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        const updatedUser = await userService.updateUser(id, updatedData);

        res.status(200).json({
            message: "User updated",
            user: updatedUser
        });
    }
    catch (error) {
        next(error);
    }

};


exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedUser = await userService.deleteUser(id);

        res.status(200).json({
            message: "User Deleted",
            user: deletedUser,
        });

    }
    catch (error) {
        next(error);
    }

};