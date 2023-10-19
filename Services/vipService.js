const VipLevel = require('../Models/vipLevelModel');
const Users =require('../Models/userModel');
const mongoose = require('mongoose');

const getVipLevels = async ()=>{
    try{
        const vipLevels = await VipLevel.find().exec();
        return vipLevels;
    }catch(err){
        console.log(err);
        return null;
    }
}

const updateVipLevels = async (_id,updateObj)=>{
    try{
        if(updateObj.level_name){
            const levelExist =await VipLevel.findOne({level_name:updateObj.level_name}).exec();
            if(levelExist){
                return 1;
            }
        }
        const updated = await VipLevel.findByIdAndUpdate({_id}, updateObj, {new:true}).exec();
        return updated;
    }catch(err){
        console.log(err);
        return null;
    }
}


const createVipLevels = async (vipObj)=>{
    try{
        const levelExist = await VipLevel.findOne({level_name:vipObj.level_name}).exec();
        if(levelExist){
            return 1;
        }
        const vipLevel = await VipLevel.create(vipObj);
        return vipLevel;
    }catch(err){
        console.log(err);
        return null;
    }
}

const deleteVipLevels = async (id)=>{
    try{
        const vipLevel = await VipLevel.findByIdAndDelete(id).exec();
        return vipLevel;
    }catch(err){
        console.log(err);
        return null;
    }
}

const updateUserVipLevel = async (userId, vipLevelId)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const userExist = await Users.findById({_id:userId}).exec();
        const vipLevelExist = await VipLevel.findById({_id:vipLevelId});
        if(!userExist || !vipLevelExist){
            await session.abortTransaction();
            session.endSession();
            //user or vip level does not exist
            return 1;
        }
        if(userExist.vip.toString() === vipLevelId.toString()){
            await session.abortTransaction();
            session.endSession();
            //user already a member of this vip level
            return 2;
        }
        if(parseInt(userExist.balance) < parseInt(vipLevelExist.level_fee)){
            await session.abortTransaction();
            session.endSession();
            //insufficient balance
            return 3;
        }
        // start transaction
        userExist.balance = parseInt(userExist.balance) - parseInt(vipLevelExist.level_fee);
        userExist.vip = vipLevelId;
        userExist.save();
        await session.commitTransaction();
        session.endSession();
        return userExist;
    }catch(err){
        console.log(err);
        await session.abortTransaction();
        session.endSession();
        return null;
    }
}





const vipService = {
    getVipLevels,
    updateVipLevels,
    createVipLevels,
    deleteVipLevels,
    updateUserVipLevel
}

module.exports = vipService;