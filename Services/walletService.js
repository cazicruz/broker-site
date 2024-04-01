const Wallet = require('../Models/walletModel')




const createWallet = async (name, address)=>{
    const wallet = await Wallet.findOne({name:name}).exec()
    try{
        if(wallet) return 1;
        const newWallet = Wallet.create({name:name,
                                         address:address});
        return newWallet;        
    }catch(err){
        console.log(err)
        return null;
    };
};

const getAllWallets = async ()=>{
    try{
        const wallet = await Wallet.find().exec();
        if (!wallet) return 1
        return wallet;
    }catch(err){
        console.log(err);
        return null;
    }
}
const getWalletById = async (id)=>{
    try{
        const wallet = await Wallet.findById(id).exec();
        if (!wallet) return 1;
        return wallet;
    }catch(err){
        console.log(err);
        return null;
    }
}

const updateWallet = async (walletObj,id)=>{
    try{
        const wallet = await Wallet.findByIdAndUpdate({_id:id},walletObj, {new:true}).exec();
        return wallet
    }catch(err){
        console.log(err);
        return null
    }
}

const deleteWallet = async (id)=>{
    try {
        const wallet = await Wallet.findByIdAndDelete(id).exec();
        return wallet;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const walletServices = {
    createWallet,
    getWalletById,
    getAllWallets,
    updateWallet,
    deleteWallet,
}

module.exports = walletServices;