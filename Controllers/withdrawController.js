const Withdrawal = require('../Models/withdrawalModel');
const User = require('../Models/userModel');
const withdrawalService = require('../Services/withdrawalService')
const userService = require('../Services/userServices')
const sendWithdrawalRequest = require('../Services/emailService')
const bcrypt = require('bcrypt');



exports.createWithdrawal = async (req, res) => {
    const { amount, receiverAddress, password} = req.body;
    const userId = req.userId;
    if (!amount || !receiverAddress || !password) {
        res.status(400).json({ msg: 'Please enter all fields' });
    }
    const user = userService.getUserById(userId);
    if (!user) {
        res.status(400).json({ msg: 'User does not exist' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400).json({ msg: 'Invalid credentials' });
    }
    if(user.balance < amount){
        res.status(400).json({ msg: 'Insufficient balance' });
    }
    const withdrawalObj = {
        amount: amount,
        receiverAddress: receiverAddress,
        receiverId: userId
    };
    const withdrawal = await withdrawalService.createWithdrawal(withdrawalObj);
    if (!withdrawal) {
        res.status(500).json({ msg: 'Error creating withdrawal' });
    }
    else if (withdrawal === 1) {
        res.status(400).json({ msg: 'User not found' });
    }
    else if (withdrawal === 2) {
        res.status(400).json({ msg: 'Insufficient balance' });
    }
    const result = sendWithdrawalRequest(user.email,withdrawalObj );
    if(!result){
        res.status(500).json({ msg: 'Error sending email' });
    }
    res.status(200).json({
        msg: 'Withdrawal created successfully',
        withdrawal: withdrawal
    });
}

const getWithdrawal = (req,res)=>{
    const {id} = req.params;
    if(!id){
        res.status(400).json({ msg: 'missing route parameter ID' });
    }
    if(id !==req.userId && req.role !== 'admin'){
        res.status(400).json({ msg: 'You cannot view this withdrawal' });
    }
    const withdrawal = withdrawalService.getWithdrawalById(id);
    if(!withdrawal){
        res.status(500).json({ msg: 'Error getting withdrawal' });
    }
    res.status(200).json({
        msg: 'Withdrawal retrieved successfully',
        withdrawal: withdrawal
    });
}

const updateWithdrawal = async (req,res)=>{
    const {id} = req.params;
    const {status} = req.body;
    if(!id){
        res.status(400).json({ msg: 'missing route parameter ID' });
    }
    if(!status || (status !== true && status !== false)){
        res.status(400).json({ msg: 'Status is required to be boolean' });
    }
    const withdrawal = await withdrawalService.updateWithdrawal(id,status);
    if(!withdrawal){
        res.status(500).json({ msg: 'Error updating withdrawal' });
    }
    else if (withdrawal === 1) {
        res.status(400).json({ msg: 'Withdrawal not found' });
    }
    else if (withdrawal === 2) {
        res.status(400).json({ msg: 'Withdrawal already confirmed' });
    }
    res.status(200).json({
        msg: 'Withdrawal updated successfully',
        withdrawal: withdrawal
    });
}

const withdrawalController = {
    createWithdrawal,
    getWithdrawal,
    updateWithdrawal
}

module.exports = withdrawalController;