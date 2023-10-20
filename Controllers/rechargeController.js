const Recharge = require('../Models/rechargeModel');
const Users = require('../Models/userModel');
const emailService = require('../Services/emailService');
const rechargeService = require('../Services/rechargeService');



const accountRecharge = async (req, res) => {
    const { amount, receiverId,transaction } = req.body;
    const file = req.file;
    console.log(file)
    if(!file){
        return res.status(400).json({msg:'screenshot is required'});
    }
    if (!amount || !receiverId || !transaction) {
        return res.status(400).json({ msg: 'All fields are required' });
    }
    const user = await Users.findById({_id:receiverId}).exec()
    const rechargeObj = {
        amount: amount,
        senderId: req.userId,
        senderEmail:user.email? user.email: null,
        transaction: transaction,
        screenshot: file.path
        
    }
    const recharge = await rechargeService.createRecharge(rechargeObj);
    if (!recharge) {
        return res.status(500).json({ msg: 'Error recharging account' });
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

const getRecharge = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'missing route parameter ID' });
    }
    if (id && req.role !== 'admin') {
        return res.status(400).json({ msg: 'You cannot view this recharge' });
    }
    const recharge = await rechargeService.getRechargeById(id);
    if (!recharge) {
        return res.status(500).json({ msg: 'Error getting recharge' });
    }
    return res.status(200).json({
        msg: 'Recharge retrieved successfully',
        recharge: recharge
    })
}


const rechargeController = {
    accountRecharge,
    getRecharge
}

module.exports = rechargeController;