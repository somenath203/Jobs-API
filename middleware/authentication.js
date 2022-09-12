const jwt = require('jsonwebtoken');

const { UnauthenticatedError } = require('../errors');


const auth = async (req, res, next) => {

    // get the authorization header
    const authHeader = req.headers.authorization;


    if(!authHeader || !authHeader.startsWith('Bearer ')) {

        throw new UnauthenticatedError('Authentication Error | No headers found')
    };


    const userToken = authHeader.split(' ')[1];

    try {
        
        // getting the payload out of the token
        const payload = jwt.verify(userToken, process.env.JWT_SECRET);

        req.user = {
            userId: payload.userId,
            fullname: payload.fullname
        };

        // we wrote 'payload.userId' and 'payload.fullname' because during the creation of token,
        // we passed the id of the user and fullname of the user to the payload like this =>
        // return jwt.sign({userId: this._id, fullname: this.fullname}, process.env.JWT_SECRET, {expiresIn: `${process.env.JWT_LIFETIME}`});
        // inside user model

        next();

    } catch (error) {
        
        throw new UnauthenticatedError('Invalid Authentication');

    }

};

module.exports = auth;