const Withdrawal = require('../Models/withdrawalModel');
const User = require('../Models/userModel');
const mongoose = require('mongoose');


const createWithdrawal = async (withdrawalObj) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const user = await Users.findById(withdrawalObj.receiverId).session(session).exec();
        if(!user){
            await session.abortTransaction();
            session.endSession();
            // user not found
            return 1;
        }
        if(user.balance < withdrawalObj.amount){
            await session.abortTransaction();
            session.endSession();
            //insufficient Balance
            return 2;
        }
        // start transaction
        user.balance -= withdrawalObj.amount;
        user.save();
        const withdrawal = new Withdrawal(withdrawalObj);
        await withdrawal.save();
        await session.commitTransaction();
        session.endSession();
        return withdrawal;

    }catch(err){
        console.log(err);
        await session.abortTransaction();
        session.endSession();
        return null;
    }
}

const getWithdrawalById = async (id) => {
    try {
        const withdrawal = await Withdrawal.findById(id).exec();
        return withdrawal;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const updateWithdrawal = async (id, status) => {
    try{
        const withdrawal = Withdrawal.findById(id).exec();
        if(!withdrawal){
            return 1;
        }
        if(withdrawal.status === status){
            return 2;
        }
        withdrawal.status = status;
        await withdrawal.save();
        return withdrawal;
    }catch(err){
        console.log(err);
        return null;
    }
}

const withdrawalService = {
    createWithdrawal,
    getWithdrawalById,
    updateWithdrawal
}
module.exports = withdrawalService;