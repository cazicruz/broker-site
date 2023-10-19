const express = require('express');
const router = express.Router();
const verifyJWT = require('../Middleware/verifyJWT');
const roleCheck = require('../Middleware/roleCheck');
const userController = require('../Controllers/userController');

router.get('/',verifyJWT, userController.getAllUsers);
router.get('/:id',verifyJWT,roleCheck, userController.getUser);
router.put('/:id',verifyJWT,roleCheck, userController.updateUser);
router.delete('/:id',verifyJWT,roleCheck, userController.deleteUser)
router.put('/do-task/:taskId',verifyJWT, userController.doTask);


module.exports = router;