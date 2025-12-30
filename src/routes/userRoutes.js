

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const validations = require('../middlewares/user_middleware');

router.get('/users', userController.getAllUsers);
router.get('/users/count', userController.countUsers);

router.get('/users/by-name/:name', validations.validateName, userController.getUserByName);

router.get('/users/:id', validations.validateObjectId, userController.getUserById);



router.post('/users', validations.isValid, userController.createUsers);
router.put('/users/:id', validations.validateObjectId, userController.updateUsers);
router.delete('/users/:id', validations.validateObjectId, userController.deleteUser);



module.exports = router;