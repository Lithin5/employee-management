const mongoose = require('mongoose');
const User = require("./User");
const Schema = mongoose.Schema;

const AttendanceSchema = new mongoose.Schema({
    userdata: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date:{
        type: Date,
        default: Date.now
    },
    status:{
        type:String,
        required:true
    },
    expression:{
        type:String
    }
});

const Attendance = mongoose.model('Attendance',AttendanceSchema);

module.exports = Attendance;