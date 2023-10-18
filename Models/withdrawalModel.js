const mongoose = require('mongoose');
const schema = mongoose.Schema


withdrawalSchema = new schema({
    amount:{
        type:String,
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverAddress:{
        type:String,
        required:true
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

module.exports= Withdrawal;
