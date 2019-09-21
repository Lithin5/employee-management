const mongoose = require('mongoose');


const CtcDataSchema = new mongoose.Schema({
    ctccategoryid: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    userid: {
        type: String,
        required: true
    }
});

const CtcData = mongoose.model('CtcData', CtcDataSchema);

module.exports = CtcData;