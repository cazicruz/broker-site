const express = require('express');
const router = express.Router();
const vipController = require('../Controllers/vipController')
const verifyJWT = require('../Middleware/verifyJWT');
const roleCheck = require('../Middleware/roleCheck');

router.get('/',vipController.getVipLevels );
router.post('/new/',verifyJWT,roleCheck,vipController.createVipLevels);
router.put('/:id',verifyJWT,roleCheck,vipController.updateVipLevels);
// update users vip level
router.put('/vip-purchase/:id',verifyJWT,roleCheck,vipController.updateUserVipLevel);
router.delete('/remove/:id',verifyJWT,roleCheck,vipController.deleteVipLevels);

module.exports = router;


/**
 * @swagger
 * /vip/:
 *   get:
 *     summary: Get VIP levels.
 *     description: Get a list of all available VIP levels.
 *     tags:
 *       - VIP
 *     responses:
 *       200:
 *         description: VIP levels retrieved successfully.
 *       500:
 *         description: Internal server error.

 * /vip/{id}:
 *   put:
 *     summary: Update a VIP level.
 *     description: Update an existing VIP level by providing the VIP level ID and the new name or amount.
 *     tags:
 *       - VIP
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the VIP level to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The email to update to.
 *               amount:
 *                 type: number
 *                 description: The email to update to.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: VIP level updated successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 *       401:
 *         description: Unauthorized. You are not authorized to update VIP levels.

 * /vip/new:
 *   post:
 *     summary: Create a new VIP level.
 *     description: Create a new VIP level by providing the name and amount.
 *     tags:
 *       - VIP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the VIP level.
 *               amount:
 *                 type: number
 *                 description: The amount associated with the VIP level.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: VIP level created successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 *       401:
 *         description: Unauthorized. You are not authorized to create VIP levels.

 * /vip/remove/{id}:
 *   delete:
 *     summary: Delete a VIP level.
 *     description: Delete a VIP level by providing its ID.
 *     tags:
 *       - VIP
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the VIP level to delete.
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: VIP level deleted successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 *       401:
 *         description: Unauthorized. You are not authorized to delete VIP levels.

 * /vip/vip-purchase/{id}:
 *   put:
 *     summary: Update a user's VIP level.
 *     description: Update a user's VIP level by providing their user ID and the new VIP level ID.
 *     tags:
 *       - VIP
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the new VIP level to assign to the user.
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User's VIP level updated successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 *       401:
 *         description: Unauthorized. You are not authorized to update user VIP levels.
 */
