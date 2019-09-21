const mongoose = require('mongoose');
const CtcCategory = require("./ctccategory");
const Schema = mongoose.Schema;

const CtcDataSchema = new mongoose.Schema({
    ctccategoryid: {
        type: Schema.Types.ObjectId, 
        ref: 'CtcCategory'
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