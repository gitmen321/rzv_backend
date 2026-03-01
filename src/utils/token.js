const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;

if (!ACCESS_TOKEN_SECRET) throw new Error("JWT_SECRET is not defined");


const generateAccesToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const generateRefreshToken = () => {

    return crypto.randomBytes(40).toString('hex');
}

module.exports = { generateAccesToken, generateRefreshToken };