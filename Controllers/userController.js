const Users = require("../Models/userModel");
const userService = require('../Services/userServices');



const getAllUsers = async (req, res)=>{
    try {
        const users = await Users.find().exec();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({msg:'Error getting users'});
    }
}

const getUser = async (req, res)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({msg:'missing route parameter ID'});
    }
    const user = await userService.getUserById(id);
    if(user===1){
        return res.status(400).json({msg:'User not found'});
    }
    if (!user){
        return res.status(500).json({msg:'Error getting user'});
    }
    return res.status(200).json({
        msg:'User retrieved successfully',
        user:user
    })
}

const updateUser = async (req, res)=>{
    const {id} = req.params;
    const {username, email} = req.body;
    if(req.userId !==id && req.role !== 'admin'){
        return res.status(400).json({msg:'You cannot update this user'});
    }
    if(!id){
        return res.status(400).json({msg:'missing route parameter ID'});
    }
    if (!username && !email){
        return res.status(400).json({msg:'Username or email is required'});
    }
    let userObj ={}
    if (username) userObj.username = username;
    if (email) userObj.email = email;
    const user = await userService.updateUser(id, userObj);
    if(!user){
        return res.status(500).json({msg:'Error updating user'});
    }
    return res.status(200).json({
        msg:'User updated successfully',
        user:user
    });
}

const deleteUser = async (req, res)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({msg:'missing route parameter ID'});
    }
    if(id !== req.userId && req.role !== 'admin'){
        return res.status(400).json({msg:'You cannot delete this user'});
    }
    const user = await userService.deleteUser(id);
    if (!user){
        return res.status(500).json({msg:'Error deleting user'});
    }
    return res.status(200).json({
        msg:'User deleted successfully',
        user:user
    });
}

const doTask = async (req,res)=>{
    const {taskId} = req.params;
    const userId = req.userId;
    if(!taskId){
        return res.status(400).json({msg:'missing route parameter ID'});
    }
    const user = userService.getUserById(userId);
    if (!user){
        return res.status(500).json({msg:'Error getting user'});
    }
    const dotask = await userService.doTask(userId, taskId);
    if (!dotask){
        return res.status(500).json({msg:'Error doing task'});
    }
    if(dotask===1){
        return res.status(400).json({msg:'User not found'});
    }
    if(dotask===2){
        return res.status(400).json({msg:'Task not found'});
    }
    if(dotask===3){
        return res.status(400).json({msg:'User already did task'});
    }
    if(dotask===4){
        return res.status(400).json({msg:'insufficient balance'});
    }
    const referalFunded = await userService.fundReferal(user.referer,7,dotask.amount);
    const referalFundedTwo = await userService.fundReferal(user.referer_two, 4, dotask.amount);
    if (!referalFunded ){
        return res.status(500).json({msg:'Error funding referer'});
    }
    if(!referalFundedTwo){
        return res.status(500).json({msg:'Error funding referer top link'});
    }
    return res.status(200).json({
        msg:'Task done successfully',
        task:dotask
    });
}


const userController = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    doTask,
}
module.exports = userController