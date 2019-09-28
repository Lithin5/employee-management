const mongoose = require("mongoose");
const User = require("./user_model");
const Schema = mongoose.Schema;

const LeavesSchema = new mongoose.Schema({
    userdetails:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    requestdate:{
        type:Date,
        required:true,
        default: Date.now
    },
    leavefrom:{
        type:Date,
        required:true
    },
    leaveto:{
        type:Date,
        required:true
    },
    leavetype:{
        type:String,
        required:true
    },
    message:{
        type:String
    },
    status:{
        type:String,
        required:true
    }
});

const Leaves = mongoose.model('Leaves',LeavesSchema);

module.exports = Leaves;