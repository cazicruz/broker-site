const walletServices = require('../Services/walletService');



const createWallet = async (req,res)=>{
    const {name, address} = req.body;
    if(!name || !address){
        return res.status(400).json({msg:"Name and Address are required"})
    }

    if(req.role !== 'admin'){
        return res.status(401).json({msg:'You cannot create wallets'});
    }

    let wallet = await walletServices.createWallet(name,address);
    if (!wallet){return res.status(500).json({msg:"error creating wallet"})}
    if (wallet ===1){return res.status(409).json({msg:"wallet already exists"})}
    return res.status(200).json({msg:"wallet created successfully",
                                 wallet});
}

const getAllWallets = async (req,res)=>{
    const wallet = await walletServices.getAllWallets();
    if (!wallet) return res.status(500).json({msg: "error getting wallets try again"})
    if(wallet===1){return res.status(400).json({msg: "error getting wallets"})}
    return res.status(200).json({msg: " All wallets retrieved successfully.",
                                 wallet});
}


const getWalletById = async(req,res)=>{
    const {id} = req.params
    const wallet = await walletServices.getWalletById(id);
    if(!wallet) return res.status(500).json({msg: "server error"})
    if (wallet== 1) return res.status(400).json({msg: "error getting wallet"})
    return res.status(200).json({msg: "wallet retrieved successfully.",
                                 wallet});
}

const updateWallet = async (req,res)=>{
    const {id} = req.params
    const {name, address} = req.body;
    
    if(req.role !== 'admin'){
        return res.status(401).json({msg:'You cannot update wallets'});
    }

    let walletObj = {};
    if (name) walletObj.name = name;
    if (address) walletObj.address = address;
    const wallet = await walletServices.updateWallet(walletObj,id);
    if (!wallet) return res.status(500).json({msg:"error updating wallet"});
    return res.status(200).json({msg: "wallet updated successfully.",
                                 wallet});
};

const deleteWallet = async (req,res)=>{
    const {id}= req.params;

    if(req.role !== 'admin'){
        return res.status(401).json({msg:'You cannot delete wallets'});
    }

    const wallet = walletServices.deleteWallet(id)
    if (!wallet) return res.status(500).json({msg:"error deleting wallet"})
    return res.status(200).json({msg:"Wallet address deleted successfully",
                                 wallet:wallet})
}


const walletController = {
    createWallet,
    getAllWallets,
    getWalletById,
    updateWallet,
    deleteWallet,
}

module.exports = walletController