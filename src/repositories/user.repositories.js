const User = require('../models/User');


class UserRepository {

    async findAll(page, limit, skip, sortField, sortOrder, filter) {

        console.log("Fetching user[repo]");
        return await User.find({ ...filter }).skip(skip).limit(limit).sort({ [sortField]: sortOrder });

    };

    async findByEmail(email) {
        return await User.findOne({ email, isActive: true });
    };

    async userByToken(hashedToken) {

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        return user;
    };

    async userByEmailToken(hashedToken) {
        const user = await User.findOne({
            emailVerifyToken: hashedToken,
            emailVerifyExpires: { $gt: Date.now() }
        });
        return user;

    }



    async findCountDocs(filter) {
        return await User.countDocuments({ ...filter });
    };

    async findActiveUsersCount(filter) {
        return await User.countDocuments({ isActive: true, ...filter });
    }

    async countCreatedToday() {
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);

        const filter = {
            createdAt: { $gte: startOfDay }
        };

        try {
            return await User.countDocuments(filter);
        } catch (err) {
            console.error('error:', err);
            throw err;
        }
    }


    async findById(id) {
        return await User.findOne({ _id: id, isActive: true });
    };


    async findByIdAdmin(id) {
        return await User.findById(id);
    }

    async findByName(name) {
        return await User.findOne({ name: name, isActive: true });
    };




    async create({ name, age, email, password }, session = null) {
        try {
            const user = new User({ name, age, email, password });
            console.log('repos try block');
            return await user.save({ session });
        }
        catch (err) {
            console.log("Actual error:", err);

            throw err;
        }
    };

    async updateStatusByAdmin(id, isActive) {
        return await User.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );
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