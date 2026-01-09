const User = require('../models/User');

const findAll = async (page, limit, skip, sortField, sortOrder, filter) => {

    console.log("Fetching user[repo]");
    return await User.find(filter).skip(skip).limit(limit).sort({ [sortField]: sortOrder });

};

const findByEmail = async (email) => {
    return await User.findOne({ email });
};




const findCountDocs = async (filter) => {
    return await User.countDocuments(filter);
};


const findById = async (id) => {
    return await User.findById(id);
};

const findByName = async (name) => {
    return await User.findOne({ name });
};

// const findByNameAndAge = async (name, age) => {
//     return await User.findOne({ name, age });
// };


const create = async ({ name, age, email, password }) => {
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



const update = async (id, updatedData) => {
    return await User.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
    );
};


const remove = async (id) => {
    return await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }

    );
};


module.exports = {
    findAll, findById, findByName, create, update, remove, findCountDocs, findByEmail
}