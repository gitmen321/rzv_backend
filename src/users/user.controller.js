const UserServices = require('./user.service');
const UserRepository = require('../repositories/user.repositories');
const WalletRepository = require('../repositories/wallet.repository');
const RefreshTokenRepository = require("../repositories/refreshToken.repository");
const TokenTransactionRepository = require("../repositories/tokenTransaction.repository");

const refreshTokenRepository = new RefreshTokenRepository();
const tokenTransactionRepository = new TokenTransactionRepository();
const walletRepository = new WalletRepository();
const userRepository = new UserRepository();
const userService = new UserServices(userRepository, walletRepository, refreshTokenRepository, tokenTransactionRepository);



exports.currentMe = async (req, res, next) => {

    try {

        const id = req.user.id;
        console.lo
        const myDetails = await userService.getUserById(id);

        return res.status(200).json({
            message: "User profile details:",
            user: myDetails
        });

    } catch (err) {
        next(err)
    }
};


exports.updateMyProfile = async (req, res, next) => {
    try {
        const id = req.user.id;
        const updatedData = req.body;

        const updatedUser = await userService.updateUser(id, updatedData);

        res.status(200).json({
            message: "User updated",
            user: updatedUser
        });
    }
    catch (error) {
        next(error);
    }

};

exports.getWallet = async (req, res, next) => {

    try {
        const id = req.user.id;
        const walletDetails = await userService.getWalletDetails(id);

        res.status(200).json({
            message: "User WalletDetails",
            data: walletDetails,
        });


    } catch (err) {
        next(err);
    }

}

exports.getTransaction = async (req, res, next) => {
    try {
        const id = req.user.id;
        const { page, limit, start, end } = req.query;

        const transactionSummary = await userService.getTransactionSummary(id, page, limit, start, end);

        res.status(200).json({
            message: "User transaction history",
            data: transactionSummary,
        });

    } catch (err) {
        next(err);
    }
}

exports.getReferralDetails = async (req, res, next) => {
    try {
        const id = req.user.id;
        const result = await userService.getReferralDetails(id);

        res.status(200).json({
            message: "User referral details",
            data: result
        });
    }
    catch (err) {
        next(err);
    }
}





exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.user.id;

        const deletedUser = await userService.deleteUser(id);

        res.status(200).json({
            message: "User Deleted",
            user: deletedUser,
        });

    }
    catch (error) {
        next(error);
    }

};