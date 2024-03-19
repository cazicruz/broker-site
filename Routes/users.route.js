const express = require('express');
const router = express.Router();
const verifyJWT = require('../Middleware/verifyJWT');
const roleCheck = require('../Middleware/roleCheck');
const userController = require('../Controllers/userController');

router.get('/',verifyJWT, userController.getAllUsers);
router.get('/user/:id',verifyJWT,roleCheck, userController.getUser);
router.get('/user',verifyJWT,roleCheck, userController.getUser);
router.put('/update/:id',verifyJWT,roleCheck, userController.updateUser);
router.put('/update/balance/:id',verifyJWT,roleCheck, userController.updateBalance);
router.delete('/:id',verifyJWT,roleCheck, userController.deleteUser)


module.exports = router;




/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users.
 *     description: Get a list of all users.
 *     tags:
 *       - Users
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       500:
 *         description: Internal server error.

 * /users/user/{id}:
 *   get:
 *     summary: Get user by ID.
 *     description: Get a user by providing their user ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.

 * /users/user:
 *   get:
 *     summary: Get user by ID.
 *     description: Get details of signed in user.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.

 * /users/update/{id}:
 *   put:
 *     summary: Update user by ID.
 *     description: Update a user by providing their user ID and the new username or email.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email to update to.
 *               username:
 *                 type: string
 *                 description: The username to update to.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 
 * /users/update/balance/{id}:
 *   put:
 *     summary: Update user balance by ID.
 *     description: Update a user by providing their user ID and the new balance.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The email to update to.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User balance updated successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.

 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID.
 *     description: Delete a user by providing their user ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 *       401:
 *         description: Unauthorized. You are not authorized to delete users.

 */
