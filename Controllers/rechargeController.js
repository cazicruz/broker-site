const Recharge = require('../Models/rechargeModel');
const Users = require('../Models/userModel');



const accountRecharge = async (req, res) => {
    const { amount, receiverId,transaction } = req.body;
    if (!amount || !receiverId || !transaction) {
        res.status(400).json({ msg: 'All fields are required' });
    }
    const rechargeObj = {
        amount: amount,
        senderId: req.userId,
        transaction: transaction,
        screenshot: req.file.path
        
    }
    const recharge = await rechargeService.createRecharge(rechargeObj);
    if (!recharge) {
        res.status(500).json({ msg: 'Error recharging account' });
    }
    res.status(200).json({
        msg: 'Recharge would be confirmed soon and status updated',
        recharge: recharge
    });
}

const getRecharge = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ msg: 'missing route parameter ID' });
    }
    if (id && req.role !== 'admin') {
        res.status(400).json({ msg: 'You cannot view this recharge' });
    }
    const recharge = await rechargeService.getRechargeById(id);
    if (!recharge) {
        res.status(500).json({ msg: 'Error getting recharge' });
    }
    res.status(200).json({
        msg: 'Recharge retrieved successfully',
        recharge: recharge
    })
}


const rechargeController = {
    accountRecharge,
    getRecharge
}

module.exports = rechargeController;