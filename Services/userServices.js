const Users = require("../Models/userModel");




const referrerCode = (username)=>{
    const randomNum = Math.floor(Math.random()*90000)+10000
    const code = `${username}${randomNum}`
    console.log(code)
    return code;
}

const findUserByEmail = async (email)=>{
    try {
        const user = await Users.findOne({email:email}).exec();
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
}


const userService = {
    referrerCode,
    findUserByEmail,
}
module.exports = userService