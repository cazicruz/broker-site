const Users = require('../Models/userModel');
const authService = require("../Services/authService");
const userService = require('../Services/userServices');
const { referrerCode } = require('../Services/userServices');
const userServices = require('../Services/userServices');
const emailService = require('../Services/emailService');
const bcrypt = require('bcrypt');


const register = async (req,res)=>{
    const {username,password,email,referer_code}= req.body;
    if(!username||!password||!email){
        return res.status(400).json({
            status:'error',
            msg:'Username, password and email are required'});
    }
    let referer 
    let refererUpline
    if(referer_code){
        referer= userServices.getReferer(referer_code);
        if(referer){
            refererUpline = userService.getSecondUpliner(referer);
        }
    }
    const refCode = referrerCode(username);
    const userObj ={
        username:username,
        password:password,
        email:email,
        referer:referer? referer:null,
        referer_two: refererUpline? refererUpline:null,
        referral_code:refCode
    };
    const newUser = await authService.register(userObj);
    if(newUser){
        return res.status(200).json(newUser);
    }
    return res.status(400).json({
        status:400,
        msg:'User already exists'})
}



const login = async (req,res)=>{
    const {email,password} = req.body;
    const user = await authService.login(email,password);
    if(!user){
        return res.status(400).send('Invalid credentials')
    }
    const tokens = authService.generateToken(user);
    authService.updateUserWithToken(user._id,tokens.refreshToken);
    return res.status(200).json(tokens);
}


const tokenRefresh = async (req,res)=> {
    const {refreshToken} = req.body;
    if(!refreshToken){
        return res.status(401).send('Access denied, token missing')
    }
    try{
        // verifies if the token is valid and gets the payload
        const userId = await authService.verifyToken(refreshToken,process.env.REFRESH_TOKEN_SECRET);

        if (!userId){
            return res.status(500).send('try again later or login');
        }
        // checks if user exists in the db
        const user = await Users.findById(userId).exec();
        // generates a new set of tokens
        if(!user){
            return res.status(401).send('Access denied, token invalid');
        }

        const token = authService.generateToken({_id:user.id});
        // save the refresh token in database
        const error = await authService.updateUserWithToken(userId,token.refreshToken);
        if (error){
            return res.status(500).send('server error please login again');
        }
        // send the new token pair back to the client
        return res.status(200).json(token);
    }catch(err){
        console.log(err);
        // Token can be expired or invalid. Send appropriate errors in each case:
        return res.status(401).send('You are not authorized, login required')
    }
}

const forgotPass = async (req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(400).send('Email is required')
    }
    const user = await userService.findUserByEmail(email);
    if(!user){
        return res.status(400).send('User not found')
    }
    const otp = emailService.sendOTP(user.username,user.email);
    console.log(otp)
    if(!otp){
        return res.status(500).send('Error sending OTP')
    }
    const timestamp = Date.now();
    user.otp = otp;
    user.otp_date = timestamp;
    user.save();
    return res.status(200).json({
        msg:'OTP sent successfully',
        timestamp:timestamp,        
    });
}

const resetPass = async (req,res)=>{
    const {email,otp,password} = req.body;
    if(!email||!otp||!password){
        return res.status(400).send('All fields are required')
    }
    const user = await userService.findUserByEmail(email);
    if(!user){
        return res.status(400).send('User not found')
    }
    if(user.otp !== otp && parseInt(user.otp) !== parseInt(otp)){
        return res.status(400).send('Invalid OTP')
    }
    const now = Date.now();
    const diff = now - user.otp_date;
    const diffInMinutes = Math.round(diff/(1000*60));
    if(diffInMinutes > 10){
        return res.status(400).send('OTP expired')
    }
    const hashedPass = await bcrypt.hash(password,10);
    user.password = hashedPass;
    user.otp = null;
    user.otp_date = null;
    user.save();
    return res.status(200).send('Password updated successfully')
}

 const authController = {
    register,
    login,
    tokenRefresh,
    forgotPass,
    resetPass
}
module.exports = authController

