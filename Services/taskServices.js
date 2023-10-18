const Task = require('../Models/taskModel');


const createTask = async (name, amount)=>{
    try {
        const task = await Task.create({name:name, amount:amount});
        return task;        
    } catch (err) {
        console.log(err);
        return null;        
    }
}

const getAllTasks = async ()=>{
    try {
        const tasks = await Task.find({}).exec();
        return tasks;
    }catch(err){
        console.log(err);
        return null;
    }
}

const getRandomTask = async (size)=>{
    try {
        const task = await Task.aggregate([{$sample:{size:size}}]);
        console.log(task);
        return task;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const updateTask = async (id, updateObj)=>{
    const {name, amount} = updateObj;
    if(!name && !amount){
        return 1;
    }
    try{
        if(name && amount){
            oldTask = await Task.findOne({id}).exec();
            if(oldTask){
                return 2;
            }
            const task = await Task.findOneAndUpdate({id},{updateObj},{new:true}).exec();
            return task;
        }
        if (name && !amount){
            oldTask = await Task.findOne({id}).exec();
            if(oldTask){
                return 2;
            }
            const task = await Task.findOneAndUpdate({id},{name:name},{new:true}).exec();
            return task;
        }
        if (!name && amount){
            const task = await Task.findOneAndUpdate({id},{amount:amount},{new:true}).exec();
            return task;
        }
    }catch(err){
        console.log(err);
        return null;
    }
}

const deleteTask = async (id)=>{
    try{
        const oldTask = await Task.findById(id).exec();
        if(!oldTask){
            return 1;
        }
        const deleted = await Task.deleteOne({_id:id}).exec();
        return deleted;
    }catch(err){
        console.log(err);
        return null;
    }
}

const taskService ={
    createTask,
    getAllTasks,
    getRandomTask,
    updateTask,
    deleteTask
}

module.exports = taskService;