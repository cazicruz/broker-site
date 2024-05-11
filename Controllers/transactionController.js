const emailService = require('../Services/emailService');
const Users = require('../Models/userModel');
const Transactions = require('../Models/transactionModel')
const transactionService = require('../Services/transactionService');
const {sendDepositRequest, sendWithdrawalRequest} = require('../Services/emailService');
const userService = require('../Services/userServices');
const bcrypt = require('bcrypt');



const accountRecharge = async (req, res) => {
    const { amount, receiverId,transaction } = req.body;
    const file = req.file;
    console.log(file)
    if(!file){
        return res.status(400).json({msg:'screenshot is required'});
    }
    if (!amount || !transaction) {
        return res.status(400).json({ msg: 'All fields are required' });
    }
    const user = await Users.findById({_id:req.userId}).exec()
    const rechargeObj = {
        amount: amount,
        userId: req.userId,
        senderEmail:user.email? user.email: null,
        ref: transaction,
        screenshot: file.path,
        type: 'deposit'        
    }
    const recharge = await transactionService.createRechargeTransaction(rechargeObj);
    if (!recharge) {
        return res.status(500).json({ msg: 'Error recharging account' });
    }
    if (recharge){
        rechargeObj.transactionId = recharge._id;
    }
    const mailRes = await emailService.sendDepositRequest(rechargeObj, file);
    if(!mailRes){
        return res.status(500).json({msg:'Error sending mail'});
    }
    return res.status(200).json({
        msg: 'Recharge would be confirmed soon and status updated',
        recharge: recharge
    });
}


const createWithdrawal = async (req, res) => {
    const { amount, receiverAddress, password} = req.body;
    const userId = req.userId;

    if (!amount || !receiverAddress || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    const user = await  userService.getUserById(userId);
    if(user ===1){
        return res.status(400).json({ msg: 'User does not exist' });
    }
    if (!user) {
        return res.status(400).json({ msg: 'server error' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }
    if(user.balance < amount){
        console.log(user.balance, amount)
        return res.status(400).json({ msg: 'Insufficient balance 1' });
    }
    const withdrawalObj = {
        amount: amount,
        userId,
        receiverAddress: receiverAddress,
        ref: 'outbound',
        type: 'withdrawal',
        receiverEmail:user.email,
    };
    const withdrawal = await transactionService.createWithdrawalTransaction(withdrawalObj);
    if (!withdrawal) {
        return res.status(500).json({ msg: 'Error creating withdrawal' });
    }
    else if (withdrawal === 1) {
        return res.status(400).json({ msg: 'User not found' });
    }
    else if (withdrawal === 2) {
        return res.status(400).json({ msg: 'Insufficient balance' });
    }
    const result = sendWithdrawalRequest(user.email,withdrawalObj );
    if(!result){
        return res.status(500).json({ msg: 'Error sending email' });
    }
    return res.status(200).json({
        msg: 'Withdrawal created successfully',
        withdrawal: withdrawal
    });
}

const getUserTransactions = async (req, res) => {
    let {id} = req.params.id;
    if(id && req.role !== 'admin'){
        return res.status(400).json({msg:"You cannot get this user's transactions. must be an admin"+id});
    }
    if(!id){
        id = req.userId;
    }
    const transactions = await transactionService.getTransactionsByUserId(id);
    if (!transactions) {
        return res.status(500).json({ msg: 'Error getting transactions' });
    }
    return res.status(200).json({
        msg: 'Transactions retrieved successfully',
        transactions: transactions
    })
}

const getTransactionById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'missing route parameter ID' });
    }

    // if(req.role !== 'admin'){
    //     return res.status(400).json({msg:'access denied'});
    // }

    const transaction = await transactionService.getTransactionById(id);
    if (!transaction) {
        return res.status(500).json({ msg: 'Error getting transaction' });
    }
    return res.status(200).json({
        msg: 'Transaction retrieved successfully',
        transaction: transaction
    })
}

const deleteTransactionById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'missing route parameter ID' });
    }
    if(req.role !== 'admin'){
        return res.status(400).json({msg:'access denied'});
    }

    const deleted = await transactionService.deleteTransactionById(id);
    if (!deleted) {
        return res.status(500).json({ msg: 'Error deleting transaction' });
    }
    return res.status(200).json({
        msg: 'Transaction deleted successfully',
        transaction: deleted
    })
}

const updateTransactionById = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!id) {
        return res.status(400).json({ msg: 'missing route parameter ID' });
    }

    if(req.role !== 'admin'){
        return res.status(400).json({msg:'access denied'});
    }

    if (!status) {
        return res.status(400).json({ msg: 'missing status field' });
    }
    const updated = await transactionService.updateTransactionById(id, status);
    if (!updated) {
        return res.status(500).json({ msg: 'Error updating transaction' });
    }
    return res.status(200).json({
        msg: 'Transaction updated successfully',
        transaction: updated
    })
}

const getWithdrawalByUser = async (req, res) => {
    const id = req.userId;
    if (!id) {
        return res.status(400).json({ msg: 'missing route parameter ID' });
    }
    const withdrawal = await transactionService.getWithdrawalByUser(id);
    
    return res.status(200).json({
        msg: 'Withdrawal retrieved successfully',
        withdrawal: withdrawal
    })
}

const getDepositByUser = async (req, res) => {
    const id = req.userId;
    if (!id) {
        return res.status(400).json({ msg: 'missing route parameter ID' });
    }
    const deposit = await transactionService.getDepositByUser(id);
    return res.status(200).json({
        msg: 'Deposit retrieved successfully',
        deposit: deposit
    })
}

const withdrawProfit = async (req, res) => {
    const {id} = req.params
    if(id !== req.userId && req.role !== "admin"){
        return res.status(404).json({msg:'unauthorized'})
    }
    const user = await Users.findById(id).exec();
    if (!user){return res.status(404).json({msg:'error getting user'})}
    const profit = user.profit
    user.balance += user.profit;
    user.profit=0;
    user.save();
    const transaction = new Transactions({
        userId:id,
        amount:profit,
        type:'investment',
        status:'completed',
        ref:'profit',
    })
    transaction.save();

    return res.status(200).json({
        msg:'profit withdrawn',
        transaction
    })

}

const fundUserProfit = async (req,res)=>{
    const {id} = req.params;
    const {amount}= req.body
    if(req.role !== "admin"){
        return res.status(404).json({msg:'admin required'})
    }
    if(typeof amount !== 'number'){
        return res.status(404).json({msg: 'amount must be a number'})
    }
    const user = await Users.findById(id).exec();
    if (!user){return res.status(404).json({msg:'error getting user'})}

    user.profit = amount;
    user.save()
    // const transaction = new Transactions({
    //     userId:id,
    //     amount:amount,
    //     type:'investment',
    //     status:'completed',
    //     ref:'profit',
    // })
    return res.status(200).json({msg:'User profit added successfully',
user});

}

const transactionController = {
    accountRecharge,
    createWithdrawal,
    getUserTransactions,
    getTransactionById,
    deleteTransactionById,
    updateTransactionById,
    getWithdrawalByUser,
    getDepositByUser,
    withdrawProfit,
    fundUserProfit

}

module.exports = transactionController;