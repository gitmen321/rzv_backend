

const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/auth.middleware');
const userController = require('./user.controller');
const validations = require('../middlewares/user_middleware');
const authorizeRole = require('../middlewares/authorizeRole');
const {ROLE} = require('../constants/auth.constants');


router.get('/users', isAuthenticated, authorizeRole(ROLE.ADMIN), userController.getAllUsers);
router.get('/users/profile', isAuthenticated, userController.userProfile)
router.get('/users/count', userController.countUsers);



router.get('/users/by-name/:name', isAuthenticated, validations.validateName, userController.getUserByName);
router.get('/users/me', isAuthenticated, userController.currentMe);


router.get('/users/:id', isAuthenticated, validations.validateObjectId, userController.getUserById);



router.post('/users', validations.isValid, userController.createUsers);
router.put('/users/:id', isAuthenticated, authorizeRole(ROLE.ADMIN), validations.validateObjectId, userController.updateUsers);
router.delete('/users/:id', isAuthenticated, authorizeRole(ROLE.ADMIN), validations.validateObjectId, userController.deleteUser);



module.exports = router;