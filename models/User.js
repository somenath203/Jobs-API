const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please provide your fullname'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    }
});

// hash password
UserSchema.pre('save', async function(){

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

});

// generate jwt
UserSchema.methods.generateToken = function() {

    // this function should be called inside controller in order to generate token for user
    
    return jwt.sign({userId: this._id, email: this.email, fullname: this.fullname}, process.env.JWT_SECRET, {expiresIn: `${process.env.JWT_LIFETIME}`});

};

// compare hash password with the one coming from the user
UserSchema.methods.comparePassword = async function(passEnteredByUser) {

    const isMatch = await bcrypt.compare(passEnteredByUser, this.password);

    return isMatch;

};


module.exports = mongoose.model('User', UserSchema);