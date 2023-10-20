const express = require('express');
const router = express.Router();
const verifyJWT = require('../Middleware/verifyJWT');
const withdrawalController = require('../Controllers/withdrawController');
const rechargeController = require('../Controllers/rechargeController');
const multer = require('multer');
const roleCheck = require('../Middleware/roleCheck');
const {multerConfig} = require('../Config/multerConfig');

//multer config
const upload = multer({storage: multerConfig});


router.post('/recharge',verifyJWT,upload.single('newFile'), rechargeController.accountRecharge);
router.get('/recharge',verifyJWT,roleCheck, rechargeController.getRecharge);
router.post('/withdraw',verifyJWT, withdrawalController.createWithdrawal);
router.get('/withdraw/:id',verifyJWT,roleCheck, withdrawalController.getWithdrawal);
router.put('/withdraw/:id', verifyJWT,roleCheck, withdrawalController.updateWithdrawal);


module.exports = router;