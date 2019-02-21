const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    real_name: {
        type: String,
        required: true,
        max: 100,
        unique: true
    },
    house_name: {
        type: String,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    moved_out: {
        type: Boolean,
        default: false
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

module.exports = mongoose.model('User', UserSchema);