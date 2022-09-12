const mongoose = require('mongoose');

const JobsSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide the position you want to hire candidate for'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId, // everytime we create a job, we will associated with an user
        ref: 'User', // we are referencing to user model'
        required: [true, 'Please provide an user']
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Job', JobsSchema);

