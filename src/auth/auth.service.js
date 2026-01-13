const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthServices {
    constructor(authRepository) {
        this.authRepository = authRepository
    }

    async loginService(email, password) {


        if (!email || !password) {
            throw new Error("EMAIL_OR_PASSWORD_REQUIRED");
        }

        const user = await this.authRepository.findByEmailWithPass(email);

        if (!user) throw new Error("INVALID_CREDENTIALS");

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new Error("INVALID_CREDENTIALS");

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        user.password = undefined;

        return {
            token,
            user
            
        };
    };
};

module.exports = AuthServices;
