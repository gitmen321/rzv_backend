const User = require('../models/User');

const findByEmailWithPass = async (email) => {
    return await User.findOne({email, isActive: true}).select('+password');
};




module.exports = {findByEmailWithPass};