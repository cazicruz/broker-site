const Users = require("../Models/userModel");
const mongoose = require('mongoose');
const Tasks = require('../Models/taskModel');




const referrerCode = (username)=>{
    const randomNum = Math.floor(Math.random()*90000)+10000;
    const code = `${username}${randomNum}`
    console.log(code)
    return code;
}

const findUserByEmail = async (email)=>{
    try {
        const user = await Users.findOne({email:email}).exec();
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const getUserById = async (id)=>{
    try {
        const user = await Users.findById(id).exec();
        if(!user){
            return 1;
        }
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const updateUser = async (_id, updateObj)=>{
    try{
        const user = await Users.findByIdAndUpdate({_id}, updateObj, {new:true}).exec();
        return user;
    }catch(err){
        console.log(err);
        return null;
    }
}

const deleteUser = async (id)=>{
    try {
        const user = await Users.findByIdAndDelete(id).exec();
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
}


const getReferer = async (referer_code)=>{
    const username = referer_code.slice(0, referer_code.length-5);
    try {
        const user = await Users.findOne({username}).exec();
        return user.username;
    } catch (err) {
        console.log(err);
        return null;
    }
}
const getSecondUpliner = async(username)=>{
    try{
        const upline = await Users.findOne({username}).exec();
        const secondUpline = upline.referer
        return secondUpline;
    }catch(err){
        console.log(err)
        return null
    }
}
const doTask = async (userId, taskId)=>{
    const  session = await mongoose.startSession();
    session.startTransaction();
    try{
        const user = await Users.findById(userId).session(session).exec();
        const task = await Tasks.findById(taskId).session(session).exec();
        if(!user){
            await session.abortTransaction();
            session.endSession();
            // user not found
            return 1;
        }
        if(!task){
            await session.abortTransaction();
            session.endSession();
            // task not found
            return 2;
        }
        if(user.taskCompleted.includes(taskId)){
            await session.abortTransaction();
            session.endSession();
            // task already completed
            return 3;
        }
        if (user.balance < task.amount){
            await session.abortTransaction();
            session.endSession();
            // insufficient balance
            return 4;
        }
// start transaction
        user.taskCompleted.push(taskId);
        user.balance += (task.amount * 10)/100;
        user.save();
        await session.commitTransaction();
        session.endSession();
        // task completed
        return user;

    }catch(err){
        console.log(err);
        await session.abortTransaction();
        session.endSession();
        return null;
    }
}

const fundReferal = async (refererId,rateInPercent, amount)=>{
    try{
        const referer = await Users.findById(refererId).exec();
        if(!referer){
            return 1;
        }
        referer.balance += (amount * rateInPercent)/100;
        referer.save();
        return referer;
    }catch(err){
        console.log(err);
        return null;
    }
}



const userService = {
    referrerCode,
    findUserByEmail,
    getUserById,
    updateUser,
    deleteUser,
    getReferer,
    getSecondUpliner,
    doTask,
    fundReferal,
}
module.exports = userService