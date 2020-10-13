const mongoose = require('mongoose');
const Schema = mongoose.Schema

const schema = new Schema({
    name: {
        type: String,
    },
    category: {
        type: String,
        enum: ['VEG', 'NOVEG'],
        default: 'NOVEG'
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String
    },
    chef: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', schema);