const mongoose = require('mongoose');


const CtcCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    payperiod:{
        type: String,
        required: true
    }
});

const CtcCategory = mongoose.model('CtcCategory',CtcCategorySchema);

module.exports = CtcCategory;