const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');


const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later.'
  };

  if (err instanceof CustomAPIError) {

    return res.status(err.statusCode).json({ errorMsg: err.message });

  }

  if (err.code && err.code === 11000) {

    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value.`;

    customError.statusCode = 400;

    return res.status(customError.statusCode).json({ errorMsg: customError.msg });

  }

  if (err.name && err.name === 'ValidationError') {

    customError.msg = Object.values(err.errors).map((item) => {
      return item.message
    }).join(',');

    customError.statusCode = 400;

    return res.status(customError.statusCode).json({ errorMsg: customError.msg });

  }

  if (err.name && err.name === 'CastError') {

    customError.msg = `The ID provided is invalid. Please check the ID and try again.`;

    customError.statusCode = 400;

    return res.status(customError.statusCode).json({ errorMsg: customError.msg });

  }

}

module.exports = errorHandlerMiddleware;
