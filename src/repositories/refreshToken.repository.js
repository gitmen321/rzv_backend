const mongoose = require('mongoose');

class RefreshTokenRepository {
    constructor(parameters) {
        
    }

    async create ({userId, token, expiresAt }, session = null){


    }

    async validToken (token){

    };

    async revokeToken(token){

    };
    async revokeAllByUser(userId){

    };

}

module.exports = RefreshTokenRepository;