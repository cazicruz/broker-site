const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh-token', authController.tokenRefresh)
router.post('/forgot-password', authController.forgotPass)
router.post('/reset-password', authController.resetPass)

module.exports = router;

