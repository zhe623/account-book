const mongoose = require('mongoose');

let AccountSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    time: Date,
    type: {
        type: Number,
        default: -1
    },
    account:{
        type: Number,
        required: true
    },
    remark: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Account', AccountSchema);