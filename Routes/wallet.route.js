const express = require('express');
const router = express.Router();
const verifyJWT = require('../Middleware/verifyJWT');
const roleCheck = require('../Middleware/roleCheck');

const walletController = require('../Controllers/walletController');

router.get('/', walletController.getAllWallets)
router.get('/wallet/:id',walletController.getWalletById);
router.post('/new',verifyJWT,roleCheck, walletController.createWallet)
router.put('/modify/:id',verifyJWT,roleCheck, walletController.updateWallet)
router.delete('/:id',verifyJWT,roleCheck, walletController.deleteWallet)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Operations related to wallets
 */

/**
 * @swagger
 * /wallet-address/:
 *   get:
 *     summary: Get all wallets.
 *     description: Get a list of all wallets.
 *     tags:
 *       - Wallet
 *     responses:
 *       200:
 *         description: Wallets retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /wallet-address/wallet/{id}:
 *   get:
 *     summary: Get wallet by ID.
 *     description: Get a wallet by providing its ID.
 *     tags:
 *       - Wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the wallet to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wallet retrieved successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /wallet-address/new:
 *   post:
 *     summary: Create a new wallet.
 *     description: Create a new wallet.
 *     tags:
 *       - Wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the wallet.
 *               address:
 *                 type: string
 *                 description: The address of the wallet.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Wallet created successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /wallet-address/modify/{id}:
 *   put:
 *     summary: Modify wallet by ID.
 *     description: Modify a wallet by providing its ID and the new details.
 *     tags:
 *       - Wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the wallet to modify.
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
 *                 description: The new name of the wallet.
 *               address:
 *                 type: string
 *                 description: The new address of the wallet.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Wallet modified successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /wallet-address/{id}:
 *   delete:
 *     summary: Delete wallet by ID.
 *     description: Delete a wallet by providing its ID.
 *     tags:
 *       - Wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the wallet to delete.
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Wallet deleted successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 */