const mongoose = require('mongoose');
const Schema = mongoose.Schema


const schema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    forgotPasswordToken: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', schema);