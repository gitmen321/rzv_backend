const User = require('../models/User');


class UserRepository {

    async findAll(page, limit, skip, sortField, sortOrder, filter) {

        console.log("Fetching user[repo]");
        return await User.find({ isActive: true, ...filter }).skip(skip).limit(limit).sort({ [sortField]: sortOrder });

    };

    async findByEmail(email) {
        return await User.findOne({ email, isActive: true });
    };




    async findCountDocs(filter) {
        return await User.countDocuments({ ...filter, isActive: true });
    };


    async findById(id) {
        return await User.findOne({ _id: id, isActive: true });
    };

    async findByName(name) {
        return await User.findOne({ name: name, isActive: true });
    };




    async create({ name, age, email, password }, session = null) {
        try {
            const user = new User({ name, age, email, password });
            console.log('repos try block');
            return await user.save();
        }
        catch (err) {
            console.log("Actual error:", err);

            throw err;
        }
    };



    async update(id, updatedData) {
        return await User.findOneAndUpdate(
            {
                _id: id,
                isActive: true
            },
            { ...updatedData },
            { new: true }
        );
    };


    async remove(id) {
        return await User.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }

        );
    };

}

module.exports = UserRepository;