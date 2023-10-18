const express = require('express');
const router = express.Router();
const verifyJWT = require('../Middleware/verifyJWT');
const roleCheck = require('../Middleware/roleCheck');
const userController = require('../Controllers/userController');

router.get('/',verifyJWT, userController.getAllUsers);
router.get('/:id',verifyJWT,roleCheck, userController.getUserById);
router.put('/:id',verifyJWT,roleCheck, userController.updateUser);
router.delete('/:id',verifyJWT,roleCheck, userController.deleteUser)


module.exports = router;