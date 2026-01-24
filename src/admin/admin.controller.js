
const UserRepository = require('../repositories/user.repositories');
const AdminServices = require('./admin.service');

const TokenTransactionRepository = require('../repositories/tokenTransaction.repository');
const WalletRepository = require('../repositories/wallet.repository');

const walletRepository = new WalletRepository();
const tokenTransactionRepository = new TokenTransactionRepository();
const userRepository = new UserRepository();

const adminServices = new AdminServices(userRepository, walletRepository, tokenTransactionRepository);

exports.getAllUsers = async (req, res, next) => {
    try {
        const query = req.query;
        const result = await adminServices.getAllUsersForAdmin(query);
        res.status(200).json({
            message: "ALL_ACTIVE_USERS",
            user: result
        });

    } catch (err) {
        next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userDetails = await adminServices.getUsersByIdForAdmin(id);
        res.status(200).json({
            message: "USER_DETAILS_BY_ID",
            user: userDetails,
        });

    } catch (err) {
        next(err);
    }
};

exports.getUserWallet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { pageNum, limitNum } = req.query;
        const walletDetails = await adminServices.getUserWalletDetails(id, pageNum, limitNum);
        res.status(200).json({
            message: "USER_WALLET_DETAILS",
            ...walletDetails
        });
    } catch (err) {
        next(err);
    }
}

exports.updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        console.log("status:", isActive);

        const updatedUserStatus = await adminServices.updateUserStatus(id, isActive);
        res.status(200).json({
            message: isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
            user: updatedUserStatus
        });
    } catch (err) {
        next(err);
    };
};

exports.adjustWalletBalance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amount, type, reason } = req.body;
        console.log("userId:", id);

        const result = await adminServices.adjustWalletBalance(id, amount, type, reason);
        const message = type === "CREDIT" ? "WALLET_CREDITED" : "WALLET_DEBITED";
        console.log("message:", message);

        res.status(200).json({
            message: message,
            ...result
        });
    } catch (err) {
        next(err);
    }
}



