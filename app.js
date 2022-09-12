require('dotenv').config();
require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const app = express();

// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// db
const connectDB = require('./db/connect');

// authnticate route
const authenticateUser = require('./middleware/authentication');


app.use(express.json());
app.use(express.static('./public'));


// security setup
app.use(helmet()); 
app.use(cors()); 
app.use(xss()); 

app.set('trust proxy', 1);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
})); 


// routes
app.get('/', (req, res) => {

  res.status(200).sendFile('index.html');

});


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = () => {

  try {

    connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );

  } catch (error) {

    console.log(error);

  }

};

start();
