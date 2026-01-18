const User = require('../models/User');


class AuthRepository {
    async findByEmailWithPass(email) {
        return await User.findOne({ email, isActive: true }).select('+password');
    };

}

module.exports = AuthRepository;