const express = require('express');
const router = express.Router();
const verifyJWT = require('../Middleware/verifyJWT');
const taskController = require('../Controllers/taskController');

router.get('/all', taskController.getAllTasks);
router.get('/random',verifyJWT, taskController.getTask);

router.post('/',verifyJWT, taskController.createTask );

router.put('/update/:id',verifyJWT, taskController.updateTask);

router.delete('/:id',verifyJWT, taskController.deleteTask);
router.put('/assign/:userId',verifyJWT, taskController.assignUserTask);

module.exports= router;


/**
 * @swagger
 * /task/:
 *   post:
 *     summary: Create a new task.
 *     description: Create a new task by providing the task name and amount.
 *     tags:
 *       - Task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the task.
 *               amount:
 *                 type: number
 *                 description: The amount associated with the task.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Task created successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.

 * /task/all:
 *   get:
 *     summary: Get all tasks.
 *     description: Get a list of all available tasks.
 *     tags:
 *       - Task
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully.
 *       500:
 *         description: Internal server error.

 * /task/random:
 *   get:
 *     summary: Get random tasks.
 *     description: Get a list of random tasks (up to 10).
 *     tags:
 *       - Task
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Random tasks retrieved successfully.
 *       500:
 *         description: Internal server error.

 * /task/update/{id}:
 *   put:
 *     summary: Update a task.
 *     description: Update an existing task by providing the task ID and the new name or amount.
 *     tags:
 *       - Task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the task to update.
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
 *                 description: The new name of the task.
 *               amount:
 *                 type: number
 *                 description: The new amount associated with the task.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.

 * /task/{id}:
 *   delete:
 *     summary: Delete a task.
 *     description: Delete a task by providing its ID.
 *     tags:
 *       - Task
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the task to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.

 * /task/assign/{userId}:
 *   put:
 *     summary: Assign tasks to a user.
 *     description: Assign tasks to a user by providing their user ID and a list of task IDs.
 *     tags:
 *       - Task
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to whom tasks will be assigned.
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of task IDs to assign to the user.
 *     responses:
 *       200:
 *         description: Tasks assigned successfully.
 *       400:
 *         description: Bad request. Check the request parameters and data.
 *       500:
 *         description: Internal server error.
 *       401:
 *         description: Unauthorized. You are not authorized to assign tasks.
 */
