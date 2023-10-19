const express = require('express');
const router = express.Router();
const verifyJWT = require('../Middleware/verifyJWT');
const withdrawalController = require('../Controllers/withdrawController');
const rechargeController = require('../Controllers/rechargeController');
const multer = require('multer');
const {multerConfig} = require('../Config/multerConfig');

//multer config
const upload = multer({storage: multerConfig});


router.post('/recharge',verifyJWT,upload.single('newFile'), rechargeController.accountRecharge);
router.post('/withdraw',verifyJWT, withdrawalController.createWithdrawal);


module.exports = router;