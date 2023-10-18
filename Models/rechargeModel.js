const mongoose = require('mongoose');
const schema = mongoose.Schema


rechargeSchema = new schema({
    amount:{
        type:String,
        required:true
    },
    transaction:{
        type:String,
        required:true
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    screenshot:{
        type:String,
        required:true
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
});

const Recharge = mongoose.model('Recharge', rechargeSchema);

module.exports = Recharge;