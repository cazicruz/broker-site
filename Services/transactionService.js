const Transaction = require('../Models/transactionModel');


const createRechargeTransaction = async (transactionObj)=>{
    try {
        const transaction = await Transaction.create(transactionObj);
        return transaction;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const createWithdrawalTransaction = async (transactionObj) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const user = await Users.findById(transactionObj.userId).session(session).exec();
        if(!user){
            await session.abortTransaction();
            session.endSession();
            // user not found
            return 1;
        }
        if(user.balance < transactionObj.amount){
            await session.abortTransaction();
            session.endSession();
            //insufficient Balance
            return 2;
        }
        // start transaction
        user.balance -= transactionObj.amount;
        user.save();
        const withdrawal = new Transaction(transactionObj);
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

const getTransactionById = async (id)=>{
    try {
        const transaction = await Transaction.findById(id).exec();
        return transaction;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const getTransactionsByUserId = async (userId)=>{
    try {
        const transactions = await Transaction.find({userId:userId}).exec();
        return transactions;
    } catch (err) {
        console.log(err);
        return null;
    }
}



const updateTransactionById = async (id,status)=>{
    try {
        const transaction = await Transaction.findByIdAndUpdate
        (id,{status:status},{new:true}).exec();
        if(transaction){
            const user = Users.findById(transaction.userId).exec();
            if(status === "completed"){
                user.balance += transaction.amount;
                user.save();
            }
        }
        return transaction;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

const deleteTransactionById = async (id)=>{
    try {
        const transaction = await Transaction.findByIdAndDelete(id).exec();
        return transaction;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const getWithdrawalByUser = async (userId)=>{
    try {
        const transaction = await Transaction.findOne({userId:userId,type:"withdrawal"}).exec();
        return transaction;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const getDepositByUser = async (userId)=>{
    try {
        const transaction = await Transaction.findOne
        ({userId:userId,type:"deposit"}).exec();
        return transaction;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const transactionService = {
    createRechargeTransaction,
    createWithdrawalTransaction,
    getTransactionById,
    getTransactionsByUserId,
    updateTransactionById,
    deleteTransactionById,
    getWithdrawalByUser,
    getDepositByUser
}
module.exports = transactionService;