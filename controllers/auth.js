const sgMail = require('@sendgrid/mail');

const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');

const  { BadRequestError, UnauthenticatedError } = require('../errors');


sgMail.setApiKey(process.env.JOBS_API_SENDGRID_API_KEY);


const register = async (req, res) => {

    const user = await User.create({ ...req.body });

    const token = user.generateToken(); 

    const emailStructure = {
        to: req.body.email,
        from: 'somenathchoudhury212@gmail.com',
        subject: 'Welcome to Jobs API',
        text: `We welcome you ${user.fullname} in our community. We hope we will be able to help you find potential candidates for your organization`
    }

    await sgMail.send(emailStructure);

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: `user created successfully. Please check the inbox of ${req.body.email} for the welcome email.`,
        user: {
            fullname: user.fullname
        },
        token
    });

};


const login = async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password) {

        throw new BadRequestError('Please provide email and password');

    };

    const user = await User.findOne({ email });

    if(!user) {

        throw new UnauthenticatedError('Invalid credentials');

    };

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect) {

        throw new UnauthenticatedError('Invalid credentials');

    };


    const token = user.generateToken();

    const emailStructure = {
        to: req.body.email,
        from: 'somenathchoudhury212@gmail.com',
        subject: 'Successful log-in in Jobs API',
        text: `Dear ${user.fullname}, you have successfully logged in inside Jobs API.`
    }

    await sgMail.send(emailStructure);

    res.status(StatusCodes.OK).json({
        success: true,
        message: `${user.fullname} logged in successfully. Please check the inbox of ${req.body.email} for email.`,
        token
    });

};


module.exports = {
    register,
    login
};