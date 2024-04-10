const mongoose = require('mongoose');
const schema = mongoose.Schema;

transactionSchema = new schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:['deposit','investment','withdrawal'],
        required:true
    },
    status:{
        type:String,
        enum:['pending','completed','failed'],
        default:'pending'
    },
    ref:{
        type:String,
        required:true
    },
    screenshot:{
        type:String,
        required:function(){
            return this.type === 'deposit'
        }
    },
    receiverAddress:{
        type:String,
        required:function(){
            return this.type === 'withdrawal'
        }
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;