const mongoose = require("mongoose");

const holdaysSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});
const Holidays = mongoose.model("Holidays", holdaysSchema);
module.exports = Holidays;