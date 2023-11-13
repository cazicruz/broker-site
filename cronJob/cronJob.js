const cron = require('node-cron');

const userService = require('../Services/userServices');
const Users = require('../Models/userModel');

const growBalance = async ()=>{
    try{
        const users = await Users.find().exec();
        for(const user of users){
            user.balance += user.balance * 0.1;
            await userService.updateUserBalance(user.id, user.balance)
        }
        console.log('user balances updated successfully ')
    }catch(err){
        console.error(err)
    }
}

cron.schedule('0 0 * * 1-6', growBalance);