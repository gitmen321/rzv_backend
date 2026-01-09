const bcrypt = require('bcrypt');

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

        user.password = undefined;

        return user;
    };
};

module.exports = AuthServices;
