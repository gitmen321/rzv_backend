const mongoose = require('mongoose');


const validDateRange = (req, res, next) => {
    const { start, end } = req.query;

    if (!start && !end) {
        return next();
    }
    if (!start || !end) {
        return res.status(400).json({
            success: false,
            message: "BOTH_START_AND_END_DATE_REQUIRED_FOR_RANGE"
        });
    }
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: "INVALID_DATE_FORMAT_PROVIDED"
        });
    }

    if (startDate >= endDate) {
        return res.status(400).json({
            success: false,
            message: "START_DATE_SHOULD_BE_LESS_THAN_END_DATE"
        });
    }
    next();
}

const isValidUpdate = (req, res, next) => {
    const { name, age } = req.body || {};

    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "body required",
        });
    }

    if (name) {
        if (name === undefined) {
            console.log("name sould be defined");
            return res.status(400).json({
                success: false,
                message: "Name required",
            });
        }
    }
    if (age) {
        if (typeof age !== "number") {
            return res.status(400).json({
                success: false,
                message: "age must be a number"
            });
        }

    }

    next();
}

const isValid = (req, res, next) => {
    const { name, age, email, password } = req.body || {};



    if (!name || !email || !password) {
        console.log(name, email);
        console.log('middleware Invalid');
        return res.status(400).json({
            success: false,
            message: "Name and Email & password required",

        });

    }

    if (age) {
        if (typeof age !== "number") {
            return res.status(400).json({
                success: false,
                message: "age must be a number"
            });
        }

    }

    next();

};

const passwordConfirmation = (req, res, next) => {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "PASSWORD & CONFIRMPASSWORD MUSTBE REQUIRED"
        });
    }

    if (password !== confirmPassword) {
        console.log('password not verified');
        return res.status(400).json({
            success: false,
            message: "PASSWORD_MISMATCH"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "PASSWORD_TOO_SHORT"
        });
    }


    next();
}

const forgotPasswordValidation = (req, res, next) => {
    if (!req.body || req.body.email === undefined) {
        return res.status(400).json({
            success: false,
            message: "Email required"
        });
    }
    const cleanedEmail = req.body.email.trim().toLowerCase();
    const emailRegrex = /^\S+@\S+\.\S+$/;

    if (!emailRegrex.test(cleanedEmail)) {
        return res.status(400).json({
            success: false,
            message: "INVALID_EMAIL_FORMAT"
        });
    }
    next();
}

const refreshTokenValidation = (req, res, next) => {

    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            success: false,
            message: "REFRESH_TOKEN_REQUIRED"
        });
    }

    req.refreshToken = refreshToken;
    next();
}

const tokenVerifyValidation = (req, res, next) => {
    if (!req.params.token) {
        return res.status(400).json({
            success: false,
            message: "TOKEN_REQUIRED"
        });
    }
    if (req.params.token.length < 20) {
        return res.status(400).json({
            success: false,
            message: "INVALID_TOKEN_FORMAT"
        });
    }
    next();

}

const resetPasswordValidation = (req, res, next) => {

    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "NEW_PASSWORD_REQUIRED"
        });
    }
    const { newPassword, confirmPassword } = req.body;
    if (!req.params.token) {
        return res.status(400).json({
            success: false,
            message: "RESET_TOKEN_REQUIRED"
        });
    }
    if (req.params.token.length < 20) {
        return res.status(400).json({
            success: false,
            message: "INVALID_TOKEN_FORMAT"
        });
    }

    if (!newPassword) {
        return res.status(400).json({
            success: false,
            message: "NEW_PASSWORD_REQUIRED"
        });
    }
    if (!confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "CONFIRM_PASSWORD_REQUIRED"
        });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "PASSWORD_MISMATCH"
        });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message: "PASSWORD_TOO_SHORT"
        });
    }
    next();
}

const validateEmail = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email Required"
        });
    }
    const emailRegrex = /^\S+@\S+\.\S+$/;

    if (!emailRegrex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "INVALID_EMAIL_FORMAT"
        });
    }
    next();
}



const validateName = (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Name required"
        });
    }
    const nameRegex = /^[a-zA-Z]+$/;

    if (!nameRegex.test(name)) {
        return res.status(400).json({
            success: false,
            message: "Invalid name format"
        });
    }

    next();
}

const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("invalid id");
        return res.status(400).json({
            success: false,
            message: "Invalid User Id format"
        });

    }

    next();
}

module.exports = {
    validDateRange, isValidUpdate, isValid, validateObjectId, validateName, passwordConfirmation,
    validateEmail, forgotPasswordValidation, resetPasswordValidation,
    tokenVerifyValidation, refreshTokenValidation
};