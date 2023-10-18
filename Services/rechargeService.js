const Recharge = require('../Models/rechargeModel');


const createRecharge = async (rechargeObj)=>{
    try {
        const recharge = await Recharge.create(rechargeObj);
        return recharge;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const getRechargeById = async ()=>{
    try {
        const recharge = await Recharge.findById(id).exec();
        return recharge;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const rechargeService = {
    createRecharge,
    getRechargeById,
}
module.exports = rechargeService;