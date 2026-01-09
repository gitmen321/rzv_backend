const User = require('../models/User');

const findByEmailWithPass = async (email) => {
    return await User.findOne({email}).select('+password');
};




module.exports = {findByEmailWithPass};