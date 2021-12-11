const mongoose = require('mongoose');


const logSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    temperature: {
        type: Number,
        required: true
    },
    entryTime: {
        type: Date,
        required: true
    },
    exitTime: {
        type: Date,
        // required: true
    },
    purpose: {
        type: String
    }
}, {
    timestamps: true
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;