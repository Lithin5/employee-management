const mongoose = require('mongoose');
const User = require("./User");
const Schema = mongoose.Schema;


const WorkScheduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userdetails: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String
    },
    sentdate: {
        type: Date
    },
    progressdate: {
        type: Date
    },
    completeddate: {
        type: Date
    },
    verifieddate: {
        type: Date
    }
});

const WorkSchedule = mongoose.model('WorkSchedule', WorkScheduleSchema);

module.exports = WorkSchedule;