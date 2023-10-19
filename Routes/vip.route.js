const express = require('express');
const router = express.Router();
const vipController = require('../Controllers/vipController')
const verifyJWT = require('../Middleware/verifyJWT');
const roleCheck = require('../Middleware/roleCheck');

router.get('/',vipController.getVipLevels );
router.post('/',verifyJWT,roleCheck,vipController.createVipLevels);
router.put('/:id',verifyJWT,roleCheck,vipController.updateVipLevels);
// update users vip level
router.put('/vip-purchase/:id',verifyJWT,roleCheck,vipController.updateUserVipLevel);
router.delete('/:id',verifyJWT,roleCheck,vipController.deleteVipLevels);

module.exports = router;