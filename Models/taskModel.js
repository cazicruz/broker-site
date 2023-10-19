const mongoose = require('mongoose');
const schema = mongoose.Schema


const taskSchema = new schema({
    amount:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;