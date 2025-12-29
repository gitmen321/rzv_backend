

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const isValid = require('../middlewares/user_middleware');

router.get('/users', userController.getAllUsers);
router.get('/users/count', userController.countUsers);

router.get('/users/:id', userController.getUserById);

router.post('/users', isValid, userController.createUsers);
router.put('/users/:id', userController.updateUsers);
router.delete('/users/:id', userController.deleteUser); 



module.exports = router;