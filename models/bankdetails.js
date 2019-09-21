const mongoose = require('mongoose');


const BankDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    accountno: {
        type: Number,
        required: true
    },
    ifsccode: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    userid:{
        type: String,
        required: true
    }
});

const BankDetails = mongoose.model('BankDetails',BankDetailsSchema);

module.exports = BankDetails;