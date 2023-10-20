const Task = require('../Models/taskModel');
const Users= require('../Models/userModel')


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
        return task;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const updateTask = async (_id, updateObj)=>{
    const {name, amount} = updateObj;
    if(!name && !amount){
        return 1;
    }
    try{
        nameExist = await Task.findOne({name:updateObj.name}).exec();
        if(nameExist){
            return 1;
        }
        const task = await Task.findOneAndUpdate({_id},{updateObj},{new:true}).exec();
        return task;
            
        // if(name && amount){
        //     oldTask = await Task.findOne({id}).exec();
        //     if(oldTask){
        //         return 2;
        //     }
        //     const task = await Task.findOneAndUpdate({id},{updateObj},{new:true}).exec();
        //     return task;
        // }
        // if (name && !amount){
        //     oldTask = await Task.findOne({id}).exec();
        //     if(oldTask){
        //         return 2;
        //     }
        //     const task = await Task.findOneAndUpdate({id},{name:name},{new:true}).exec();
        //     return task;
        // }
        // if (!name && amount){
        //     const task = await Task.findOneAndUpdate({id},{amount:amount},{new:true}).exec();
        //     return task;
        // }
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

const assignTasksToUser = async (userId, taskIds)=>{
    try{
        const user = await Users.findById(userId).exec();
        if(!user){
            return 1;
        }
        const tasks = await Task.find({_id:{$in:taskIds}}).exec();
        if(tasks.length !== taskIds.length){
            return 2;
        }
        if(checkTimeDifference(user.taskAssigned.dateAssigned) < 1){
            return 3;
        }
        user.taskAssigned.taskIds=taskIds;
        user.taskAssigned.dateAssigned = Date.now();
        user.save();
        return user;
    }catch(err){
        console.log(err);
        return null;
    }
}

const checkTimeDifference = (dateAssigned)=>{
    const date1 = new Date(dateAssigned);
    const date2 = new Date(Date.now());
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

const taskService ={
    createTask,
    getAllTasks,
    getRandomTask,
    updateTask,
    deleteTask,
    assignTasksToUser
}

module.exports = taskService;