const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
            default: false,
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: Date
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerifyToken: {
            type: String,
        },
        emailVerifyExpires: {
            type: Date,
        }

    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function () {

    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
});

userSchema.methods.createEmailVerificationToken = function () {

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    this.emailVerifyToken = hashedToken;
    this.emailVerifyExpires = Date.now() + 15 * 60 * 1000;

    return rawToken;
}


module.exports = mongoose.model('User', userSchema);