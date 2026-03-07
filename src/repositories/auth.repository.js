const User = require('../models/User');


class AuthRepository {
    async findByAdminEmailWithPass(email) {
        return await User.findOne({ email, isActive: true, role:"admin" }).select('+password');
    };
    async findByUserEmailWithPass(email) {
        return await User.findOne({ email, isActive: true, role:"user" }).select('+password');
    };


}

module.exports = AuthRepository;