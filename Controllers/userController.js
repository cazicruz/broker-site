const Users = require("../Models/userModel");
const userService = require('../Services/userServices');



const getAllUsers = async (req, res)=>{
    if(req.role !== 'admin'){
        return res.status(400).json({msg:'access denied'});
    }
    try {
        const users = await Users.find().exec();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({msg:'Error getting users'});
    }
}

const getUser = async (req, res)=>{
    let {id} = req.params;
    if(!id){
        id=req.userId;
        if(!id){
            return res.status(400).json({msg:'missing route parameter ID'});
        }
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
const updateBalance = async (req, res)=>{
    const {id} = req.params;
    const {amount} = req.body;
    if(req.role !== 'admin'){
        return res.status(400).json({msg:'You cannot update this user balance'});
    }
    if(!id){
        return res.status(400).json({msg:'missing route parameter ID'});
    }
    if (!amount){
        return res.status(400).json({msg:'Amount is required'});
    }
    let userObj ={}
    userObj.balance = amount;

    const user = await userService.updateUser(id, userObj);
    if(!user){
        return res.status(500).json({msg:'Error updating user'});
    }
    return res.status(200).json({
        msg:'User balance updated successfully',
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




const userController = {
    getAllUsers,
    getUser,
    updateUser,
    updateBalance,
    deleteUser,
}
module.exports = userController
