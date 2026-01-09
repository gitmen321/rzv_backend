const User = require('../models/User');
const authRepository = require('./auth.repository');
const AuthServices = require('./auth.service');

const authServices = new AuthServices(authRepository);

exports.loginValidation = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        const loginUser = await authServices.loginService(email, password);
        res.status(200).json({
            User: loginUser,
            message: "User is valid"
        });

    } catch (err) {

        next(err);

    };

};