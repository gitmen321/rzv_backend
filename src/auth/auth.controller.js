const authRepository = require('./auth.repository');
const AuthServices = require('./auth.service');

const authServices = new AuthServices(authRepository);

exports.loginValidation = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        const loginUser = await authServices.loginService(email, password);
        res.status(200).json({
            message: "login successful",
            User: loginUser
        });

    } catch (err) {

        next(err);

    };

};

//   exports.getProfile = (req, res) => {
//     res.status(200).json({
//         message : "profile accessed successfully",
//         user: req.user
//     });
