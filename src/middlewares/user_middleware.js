const mongoose = require('mongoose');


const isValid = (req, res, next) => {
    const { name, age, email, password } = req.body || {};



    if (!name || !email || !password) {
        console.log(name, email);
        console.log('middleware Invalid');
        return res.status(400).json({
            message: "Name and Email & password required",

        });

    }

    if (age) {
        if (typeof age !== "number") {
            return res.status(400).json({
                message: "age must be a number"
            });
        }

    }

    console.log('middleware valid');
    next();

};

const validateName = (req, res, next) => {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({
            message: "Name required"
        });
    }
    const nameRegex = /^[a-zA-Z]+$/;

    if (!nameRegex.test(name)) {
        return res.status(400).json({
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
            message: "Invalid User Id format"
        });

    }

    next();
}

module.exports = { isValid, validateObjectId, validateName };