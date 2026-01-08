const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,

        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },

    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;


    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);