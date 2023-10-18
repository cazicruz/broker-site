const taskService = require('../services/taskService');


const createTask = async (req,res)=>{
    const {name, amount} = req.body;
    if(!name || !amount){
        res.status(400).json({msg:'Name and amount are required'});
    }
    const task = await taskService.createTask(name,amount);
    if (!task){
        res.status(500).json({msg:'Error creating task'});
    }
    res.status(200).json({
        msg:'Task created successfully',
        task:task
    })
}
const getAllTasks = async (req,res)=>{
    const tasks = await taskService.getAllTasks();
    if(!tasks){
        res.status(500).json({msg:'Error getting tasks'});
    }
    res.status(200).json({
        msg:'Tasks retrieved successfully',
        tasks:tasks
    })
}

const getTask = async (req,res)=>{
    const tasks = await taskService.getRandomTask(3);
    if(!tasks){
        res.status(500).json({msg:'Error getting tasks'});
    }
    res.status(200).json({
        msg:'Tasks retrieved successfully',
        tasks:tasks
    })
}

const updateTask = async (req,res)=>{
    const {id} = req.params;
    const {name, amount} = req.body;
    if (!name && !amount){
        res.status(400).json({msg:'Name or amount is required'});
    }
    const updateObj = {
        name:name?name:null,
        amount:amount?amount:null
    }
    const task = await taskService.updateTask(id,updateObj);
    if(!task){
        res.status(500).json({msg:'Error updating task'});
    }
    if(task===1){
        res.status(400).json({msg:'Name or amount is required'});
    }
    if(task===2){
        res.status(400).json({msg:'Task with name already exists'});
    }
    res.status(200).json({
        msg:'Task updated successfully',
        task:task
    })
}

const deleteTask = async (req,res)=>{
    const {id} = req.params;
    const task = await taskService.deleteTask(id);
    if(!task){
        res.status(500).json({msg:'Error deleting task'});
    }
    if(task===1){
        res.status(400).json({msg:'Task not found'});
    }
    res.status(200).json({
        msg:'Task deleted successfully',
        task:task
    })
}


const taskController = {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask
}

module.exports = taskController;