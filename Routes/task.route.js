const express = require('express');
const router = express.Router();
const verifyJWT = require('../Middleware/verifyJWT');
const taskController = require('../Controllers/taskController');

router.get('/', taskController.getAllTasks);
router.get('/random',verifyJWT, taskController.getTask);

router.post('/',verifyJWT, taskController.createTask );

router.put('/:id',verifyJWT, taskController.updateTask);

router.delete('/:id',verifyJWT, taskController.deleteTask);

module.exports= router;
