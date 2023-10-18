const express = require('express');
const router = express.Router();
const vipController = require('../Controllers/vipController')
const verifyJWT = require('../Middleware/verifyJWT');
const roleCheck = require('../Middleware/roleCheck');

router.get('/',vipController.getVipLevels );
router.post('/',verifyJWT,roleCheck,vipController.createVipLevels);
router.put('/',verifyJWT,roleCheck,vipController.updateVipLevels);
// update users vip level
router.put('/vip-purchase',verifyJWT,roleCheck,vipController.updateUserVipLevel);
router.delete('/',verifyJWT,roleCheck,vipController.deleteVipLevels);

module.exports = router;