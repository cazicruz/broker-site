const mongoose = require('mongoose');
const schema = mongoose.Schema;


const vipLevelSchema = new schema({
    level_name:{
        type:String,
        required:true
    },
    level_fee:{
        type:Number,
        required:true
    }

})

const VipLevel = mongoose.model('VipLevel',vipLevelSchema);

module.exports = VipLevel;