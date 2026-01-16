const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthServices {
    constructor(authRepository) {
        this.authRepository = authRepository
    }

    async loginService(email, password) {

        
        if (!email || !password) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const user = await this.authRepository.findByEmailWithPass(email);

        if (!user) throw new Error("USER_NOT_EXISTED");

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new Error("INVALID_CREDENTIALS");

        console.log('ROLE FROM DB:', user.role);

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                
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
