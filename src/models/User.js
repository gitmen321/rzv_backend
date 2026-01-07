const mongoose = require('mongoose');

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
            index: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role:{
            type: String,
            enum: ['user','admin'],
            default: 'user',
            required: true,
        },
        isActive:{
            type: Boolean,
            default : true,     
        },
        
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);