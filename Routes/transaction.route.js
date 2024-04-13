const express = require('express');
const router = express.Router();
const verifyJWT = require('../Middleware/verifyJWT');
const transactionController = require('../Controllers/transactionController');
const roleCheck = require('../Middleware/roleCheck');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const {multerConfig} = require('../Config/multerConfig');


const upload = multer({storage: multerConfig});


router.post('/recharge', verifyJWT,upload.single('newFile'), asyncHandler(transactionController.accountRecharge));
router.post('/withdrawal', verifyJWT, asyncHandler(transactionController.createWithdrawal));
router.put('/update/:id', verifyJWT, roleCheck, asyncHandler(transactionController.updateTransactionById));
router.get('/withdrawals', verifyJWT, asyncHandler(transactionController.getWithdrawalByUser));
router.get('/deposits', verifyJWT, asyncHandler(transactionController.getDepositByUser));
router.get('/', verifyJWT, asyncHandler(transactionController.getUserTransactions));
router.get('/:id', verifyJWT, roleCheck, asyncHandler(transactionController.getTransactionById));
router.delete('/delete/:id', verifyJWT, roleCheck, asyncHandler(transactionController.deleteTransactionById));
router.post('withdrawal/profit/:id',verifyJWT,roleCheck, asyncHandler(transactionController.withdrawProfit));
router.put('fund/profit/:id',verifyJWT,roleCheck, asyncHandler(transactionController.fundUserProfit));

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API endpoints for managing transactions
 */

/**
 * @swagger
 * /transactions/recharge:
 *   post:
 *     summary: Recharge account
 *     description: Recharges the user's account with the specified amount.
 *     tags: [Transactions]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to recharge.
 *                 example: 100
 *               transaction:
 *                 type: string
 *                 description: The transaction reference.
 *                 example: TX123456
 *               newFile:
 *                 type: file
 *                 description: The screenshot file of the transaction.
 *     responses:
 *       '200':
 *         description: Recharge successful.
 *       '400':
 *         description: Bad request. One or more required fields are missing.
 *       '500':
 *         description: Internal server error.
 */


/**
 * @swagger
 * /transactions/withdrawal:
 *   post:
 *     summary: Create a withdrawal
 *     description: Initiates a withdrawal from the user's account to the specified address.
 *     tags: [Transactions]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to withdraw.
 *               receiverAddress:
 *                 type: string
 *                 description: The address to withdraw to.
 *               password:
 *                 type: string
 *                 description: The user's password for authentication.
 *             required:
 *               - amount
 *               - receiverAddress
 *               - password
 *     responses:
 *       '200':
 *         description: Withdrawal successful.
 *       '400':
 *         description: Bad request. One or more required fields are missing or invalid.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /transactions/update/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     description: Updates the status of a transaction by its ID.
 *     tags: [Transactions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the transaction to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the transaction.
 *                 example: completed
 *             required:
 *               - status
 *     responses:
 *       '200':
 *         description: Transaction updated successfully.
 *       '400':
 *         description: Bad request. ID or status is missing.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /transactions/withdrawals:
 *   get:
 *     summary: Get user's withdrawals
 *     description: Retrieves all withdrawals made by the user.
 *     tags: [Transactions]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the list of withdrawals.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /transactions/deposits:
 *   get:
 *     summary: Get user's deposits
 *     description: Retrieves all deposits made by the user.
 *     tags: [Transactions]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the list of deposits.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get user's transactions
 *     description: Retrieves all transactions associated with the user.
 *     tags: [Transactions]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the list of transactions.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     description: Retrieves a specific transaction by its ID.
 *     tags: [Transactions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the transaction to retrieve
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the requested transaction.
 *       '400':
 *         description: Bad request. ID is missing.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /transactions/delete/{id}:
 *   delete:
 *     summary: Delete transaction by ID
 *     description: Deletes a specific transaction by its ID.
 *     tags: [Transactions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the transaction to delete
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the deleted transaction.
 *       '400':
 *         description: Bad request. ID is missing.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /transactions/withdrawal/profit/{id}:
 *   post:
 *     summary: Credits user from investment by ID
 *     description: searches for user by  ID and moves funds to user balance from investment account.
 *     tags: [Transactions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to credit
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the deposit transaction.
 *       '400':
 *         description: Bad request. ID is missing.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /transactions/fund/profit/{id}:
 *   put:
 *     summary: add profits into user investment wallet
 *     description: updates user profile with profit.
 *     tags: [Transactions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: value to add to user wallet.
 *                 example: 10
 *             required:
 *               - status
 *     responses:
 *       '200':
 *         description: User profit added successfully.
 *       '400':
 *         description: Bad request. ID or status is missing.
 *       '500':
 *         description: Internal server error.
 */
