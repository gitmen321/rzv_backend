// const e = require('express');
const userService = require('../../services/userService');

exports.getAllUsers = (req, res) => {
    const users = userService.getAllUsers();
    console.log("Users from services", users);
    res.status(200).json(users);
}

exports.countUsers = (req, res) => {
    const usersCount = userService.countUser();
    res.status(200).json({
        message: "User count is:",
        user: usersCount,
    });
};

exports.getUserById = (req, res, next) => {

    try {
        const id = parseInt(req.params.id);
        const user = userService.getUserById(id);
        res.status(200).json(user);
    }

    catch (error) {
        next(error);

    }
};



exports.createUsers = (req, res, next) => {

    try {
        const newUser = req.body;


        const cretatedUser = userService.createUser(newUser);

        res.status(201).json({
            user: cretatedUser,
        });
    }

    catch (error) {
        next(error);

    }
};

exports.updateUsers = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const updatedData = req.body;

        const updatedUser = userService.updateUser(id, updatedData);

        res.status(200).json({
            message: "User updated",
            user: updatedUser
        });
    }
    catch (error) {
        next(error);
    }

};


exports.deleteUser = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const deletedUser = userService.deleteUser(id);

        res.status(200).json({
            message: "User Deleted",
            user: deletedUser,
        });

    }
    catch (error) {
        next(error);
    }

};