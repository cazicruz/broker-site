const vipService = require('../Services/vipService');

const getVipLevels = async (req,res)=>{
    const vipLevels = await vipService.getVipLevels();
    return res.status(200).json({
        msg:'Vip Levels retrieved successfully',
        vipLevels:vipLevels
    })
}

const updateVipLevels = async (req,res)=>{
    const {id} = req.params;
    const {name, amount} = req.body;
    if(!id){
        return res.status(400).json({msg:'path parameter Id is required'});
    }
    if(req.role !== 'admin'){
        return res.status(400).json({msg:'You cannot update vip level'});
    }
    if (!name && !amount){
        return res.status(400).json({msg:'Name or amount is required'});
    }
    let updateObj ={}
    if (name) updateObj.level_name = name;
    if (amount) updateObj.level_fee = amount;

    const vipLevel = await vipService.updateVipLevels(id,updateObj);
    if(!vipLevel){
        return res.status(500).json({msg:'Error updating vip level'});
    }
    
    if(vipLevel===1){
        return res.status(400).json({msg:'Vip level with name already exists'});
    }
    return res.status(200).json({
        msg:'Vip level updated successfully',
        vipLevel:vipLevel
    });
}


const createVipLevels = async (req,res)=>{
    const {name, amount} = req.body;
    if(req.role !== 'admin'){
        return res.status(400).json({msg:'You cannot create vip level'});
    }
    if(!name || !amount){
        return res.status(400).json({msg:'Name and amount are required'});
    }
    const vipLevel = await vipService.createVipLevels({level_name:name,level_fee:amount});
    if(vipLevel === 1){
        return res.status(400).json({msg:'Vip level with name already exists'});
    }
    if (!vipLevel){
        return res.status(500).json({msg:'Error creating vip level'});
    }
    return res.status(200).json({
        msg:'Vip level created successfully',
        vipLevel:vipLevel
    })
}

const deleteVipLevels = async (req,res)=>{
    const {id} = req.params;
    if(req.role !== 'admin'){
        return res.status(400).json({msg:'You cannot delete vip level'});
    }
    const vipLevel = await vipService.deleteVipLevels(id);
    if(!vipLevel){
        return res.status(500).json({msg:'Error deleting vip level'});
    }
    return res.status(200).json({
        msg:'Vip level deleted successfully',
        vipLevel:vipLevel
    })
}

const updateUserVipLevel = async (req,res)=>{
    const {id} = req.params;
    const userId = req.userId;
    const user = await vipService.updateUserVipLevel(userId, id);
    if (user === 1){
        return res.status(400).json({msg:'User or vip level do not exist'});
    }else if(user === 2){
        return res.status(400).json({msg:'User already has this vip level'});
    }else if(user === 3){
        return res.status(400).json({msg:'insufficient balance'});
    }else if(!user){
        return res.status(500).json({msg:'Error updating user vip level'});
    }
    return res.status(200).json({
        msg:'User vip level updated successfully',
        user:user
    })
}


const vipController = {
    getVipLevels,
    updateVipLevels,
    createVipLevels,
    deleteVipLevels,
    updateUserVipLevel
}

module.exports = vipController;