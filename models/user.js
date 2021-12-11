const mongoose = require('mongoose');

// diff storage location for diff uploaded files
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
    },
    enrollmentnumber: {
        type: String,
    },
    avatar: {
        type: String
    },
    logs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Log'
        }
    ],
    vaccination: {
        type: String,
        enum: ['0','1','Both','NA']
    },
    category: {
        type: String,
        required: true,
        enum: ['Student','Admin','Visitor']
    }
}, {
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

// static functions
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);
// timestamps for doc create and update

module.exports = User;
