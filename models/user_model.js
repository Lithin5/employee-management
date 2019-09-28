const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    power: {
        type: Number
    },
    gender: {
        type: String
    },
    dob: {
        type: Date
    },
    address: {
        type: String
    },
    pincode: {
        type: String
    },
    status: {
        type: String
    },
    designation: {
        type: String
    },
    profilepicture: {
        type: String
    }
});

const User = mongoose.model('User',UserSchema);

module.exports = User;