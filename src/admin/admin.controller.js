
const UserRepository = require('../repositories/user.repositories');
const UserServices = require('../users/user.service');
const AdminServices = require('./admin.service');

const userRepository = new UserRepository();

const adminServices = new AdminServices(userRepository);

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
}

