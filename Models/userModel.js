const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username : {
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    balance:{
        type:Number,
        default:0
    },
    plan:{
        type:String,
        enum:['amateur', 'advanced', 'professional'],
        required:false
    },
    profit:{
        type:Number,
        default:0
    },
    referer:{
        type:String,
        required:false
    },
    referer_two:{
        type:String,
        required:false
    },
    referral_code:{
        type:String
    },
    otp:{
        type: Number,
      },
    otp_date:{
        type:Date,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    suspended: {
        type:Boolean,
        default:false
    },
    refreshToken: String,
})
const Users = mongoose.model('User',userSchema);

module.exports= Users;