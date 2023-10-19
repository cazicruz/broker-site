const taskService = require('../Services/taskServices');


const createTask = async (req,res)=>{
    const {name, amount} = req.body;
    if(!name || !amount){
        return res.status(400).json({msg:'Name and amount are required'});
    }
    const task = await taskService.createTask(name,amount);
    if (!task){
        return res.status(500).json({msg:'Error creating task'});
    }
    return res.status(200).json({
        msg:'Task created successfully',
        task:task
    })
}
const getAllTasks = async (req,res)=>{
    const tasks = await taskService.getAllTasks();
    if(!tasks){
        return res.status(500).json({msg:'Error getting tasks'});
    }
    return res.status(200).json({
        msg:'Tasks retrieved successfully',
        tasks:tasks
    })
}

const getTask = async (req,res)=>{
    const tasks = await taskService.getRandomTask(10);
    if(!tasks){
        return res.status(500).json({msg:'Error getting tasks'});
    }
    return res.status(200).json({
        msg:'Tasks retrieved successfully',
        tasks:tasks
    })
}

const updateTask = async (req,res)=>{
    const {id} = req.params;
    const {name, amount} = req.body;
    if (!name && !amount){
        return res.status(400).json({msg:'Name or amount is required'});
    }
    let updateObj = {}
    if(name) updateObj.name = name;
    if(amount) updateObj.amount = amount;

    const task = await taskService.updateTask(id,updateObj);
    if(!task){
        return res.status(500).json({msg:'Error updating task'});
    }
    
    if(task===1){
        return res.status(400).json({msg:'Task with name already exists'});
    }
    return res.status(200).json({
        msg:'Task updated successfully',
        task:task
    })
}

const deleteTask = async (req,res)=>{
    const {id} = req.params;
    const task = await taskService.deleteTask(id);
    if(!task){
        return res.status(500).json({msg:'Error deleting task'});
    }
    if(task===1){
        return res.status(400).json({msg:'Task not found'});
    }
    return res.status(200).json({
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