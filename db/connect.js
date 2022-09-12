const mongoose = require('mongoose')

const connectDB = (url) => {
  
  return mongoose.connect(url, () => {

    console.log('connection to mongoDB is successful');

  });
}

module.exports = connectDB;
