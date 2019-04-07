const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connection = require('./model/db');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('./config/config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const votingCandidates = require('./routes/votingCandidates');

const app = express();
app.use(cors());

function loggedIn(req, res, next) {
  let token = req.headers.authorization;
  if (req.url == '/users/login') {
    next();
  } else if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          data: null,
          success: false,
          message: 'Token is not valid/Not a valid logged-In user'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
      res.status(401).send('Unauthorised!!! Please login');
  }
}

app.use(loggedIn);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/candidate', votingCandidates);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process
  .on('unhandledRejection', (reason, p) => {
    // close resources before going down
    console.error(reason, 'Unhandled Rejection', p);
  })
  .on('uncaughtException', err => {
    // close resources before going down
    // write the error in log file before going down
    console.error(err, 'Uncaught Exception thrown');
    // fs.writeSync(1, `Uncaught exception: ${err}\n`);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT. Press Control-D to exit.');
  });
  
  // Using a single function to handle multiple signals
  function handle(signal) {
    // close resources before going down
    console.log(`Received ${signal}`);
  }

  // can add more events to catch and do the needful
  
  process.on('SIGINT', handle);
  process.on('SIGTERM', handle);
  

module.exports = app;