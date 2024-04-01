const mongoose = require('mongoose');
const schema = mongoose.Schema;

walletSchema = new schema({
    name: {
        type:String,
        unique:true,
        required:true,
    },
    address:{
        type:String,
        unique:true,
        required:true
    },
})
 
const Wallets = mongoose.model('Wallet',walletSchema);
module.exports= Wallets;