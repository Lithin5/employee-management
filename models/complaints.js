const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const ComplaintsSchema = new mongoose.Schema({
    userdetails: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    remarks: {
        type: String        
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Complaints = mongoose.model('Complaints', ComplaintsSchema);
module.exports = Complaints;