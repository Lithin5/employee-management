const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const PayrollSchema = new mongoose.Schema({
    userdetails: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

const Payroll = mongoose.model('Payroll', PayrollSchema);

module.exports = Payroll;