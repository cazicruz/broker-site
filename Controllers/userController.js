const Users = require("../Models/userModel");
const userService = require('../Services/userServices');



const getAllUsers = async (req, res)=>{
    try {
        const users = await Users.find().exec();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({msg:'Error getting users'});
    }
}

const getUser = async (req, res)=>{
    const {id} = req.params;
    if(!id){
        res.status(400).json({msg:'missing route parameter ID'});
    }
    const user = await userService.getUserById(id);
    if (!user){
        res.status(500).json({msg:'Error getting user'});
    }
    res.status(200).json({
        msg:'User retrieved successfully',
        user:user
    })
}

const updateUser = async (req, res)=>{
    const {id} = req.params;
    const {username, email} = req.body;
    if(!id){
        res.status(400).json({msg:'missing route parameter ID'});
    }
    if (!username && !email){
        res.status(400).json({msg:'Username or email is required'});
    }
    let userObj ={}
    if (username) userObj.username = username;
    if (email) userObj.email = email;
    const user = await userService.updateUser(id, userObj);
}

const deleteUser = async (req, res)=>{
    const {id} = req.params;
    if(!id){
        res.status(400).json({msg:'missing route parameter ID'});
    }
    if(id !== req.userId && req.role !== 'admin'){
        res.status(400).json({msg:'You cannot delete this user'});
    }
    const user = await userService.deleteUser(id);
    if (!user){
        res.status(500).json({msg:'Error deleting user'});
    }
    res.status(200).json({
        msg:'User deleted successfully',
        user:user
    });
}


const userController = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
}
module.exports = userController