const createError = require('http-errors');
const express = require('express');
const dotenv = require("dotenv");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const devicesRouter = require('./routes/devices');
const cors = require('cors');

const app = express();

dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
console.log(`allowedOrigins: ${allowedOrigins}`);
const corsOptions = {
    //origin: ['http://localhost:3000', 'http://localhost:5000'], // Allow requests from this origin
    origin: allowedOrigins, // Allow requests from this origin
    credentials: true // Allow credentials
};
app.use(cors(corsOptions));
//app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/* MongoDB connection */
var mongooseRetryCount = 0;
const mongooseMaximumRetryCount = 10;
const mongooseRetryTimeout = 5000;

function mongooseConnectWithRetry() {
    console.log('[SUBANESH] Requesting MongoDB connection...');

    mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    })
        .catch((err) => {
            console.log(`[SUBANESH] Error in MongoDB connection...`);
            console.error(err.stack)
            mongooseRetryCount++;
            if (mongooseRetryCount < mongooseMaximumRetryCount) {
                console.log(`[SUBANESH] Retrying count: ${mongooseRetryCount}, Requesting MongoDB connection in ${mongooseRetryTimeout} Seconds...`);
                setTimeout(mongooseConnectWithRetry, mongooseRetryTimeout);
            } else {
                console.log(`[SUBANESH] Retrying count: ${mongooseRetryCount}, Maximum retries reached. Exiting...`);
                mongooseRetryCount = 0;
                process.exit(1);
            }
        });
}

mongooseConnectWithRetry();
mongoose.connection.on('connected', () => { console.log('[SUBANESH] MongoDB connected...'); });
mongoose.connection.on('disconnected', () => { console.log('[SUBANESH] MongoDB disconnected...'); });


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/devices', devicesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
