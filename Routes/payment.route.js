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


router.post('/account',verifyJWT,upload.single('newFile'), rechargeController.accountRecharge);
router.get('/recharge/:id',verifyJWT,roleCheck, rechargeController.getRecharge);
router.post('/withdraw',verifyJWT, withdrawalController.createWithdrawal);
router.get('/withdraw/:id',verifyJWT,roleCheck, withdrawalController.getWithdrawal);
router.put('/withdraw/update/:id', verifyJWT,roleCheck, withdrawalController.updateWithdrawal);


module.exports = router;


/**
 * @swagger
 * /payment/account:
 *   post:
 *     summary: Create a new recharge for a user's account.
 *     description: Upload a screenshot and provide the required information to recharge a user's account.
 *     tags:
 *       - Recharge
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The recharge amount.
 *               receiverId:
 *                 type: string
 *                 description: The ID of the receiver's account.
 *               transaction:
 *                 type: string
 *                 description: The transaction details.
 *               newFile:
 *                 type: file
 *                 description: The screenshot of the transaction.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Recharge created successfully. The status will be updated soon.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 *
 * /payment/recharge/{id}:
 *   get:
 *     summary: Get recharge details by ID.
 *     description: Get the details of a recharge by providing its ID.
 *     tags:
 *       - Recharge
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the recharge.
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Recharge details retrieved successfully.
 *       400:
 *         description: Bad request. Ensure you provide a valid recharge ID.
 *       500:
 *         description: Internal server error.
 *       401:
 *         description: Unauthorized. You are not authorized to view this recharge.
 */


// comments for withdrawal

/**
 * @swagger
 * /payment/withdraw:
 *   post:
 *     summary: Create a new withdrawal request.
 *     description: Create a withdrawal request by providing the amount, receiver address, and user's password.
 *     tags:
 *       - Withdrawal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The withdrawal amount.
 *               receiverAddress:
 *                 type: string
 *                 description: The address to which the withdrawal will be sent.
 *               password:
 *                 type: string
 *                 description: The user's password for verification.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Withdrawal request created successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 *
 * /payment/withdraw/{id}:
 *   get:
 *     summary: Get withdrawal details by ID.
 *     description: Get the details of a withdrawal request by providing its ID.
 *     tags:
 *       - Withdrawal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the withdrawal request.
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Withdrawal details retrieved successfully.
 *       400:
 *         description: Bad request. Ensure you provide a valid withdrawal ID.
 *       500:
 *         description: Internal server error.
 *       401:
 *         description: Unauthorized. You are not authorized to view this withdrawal.
 *
 * /payment/withdraw/update/{id}:
 *   put:
 *     summary: Update the status of a withdrawal request.
 *     description: Update the status of a withdrawal request by providing its ID and the new status (true or false).
 *     tags:
 *       - Withdrawal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the withdrawal request.
 *         schema:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: Status of transaction.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Withdrawal request updated successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 *       401:
 *         description: Unauthorized. You are not authorized to update this withdrawal.
 */
