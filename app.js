var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var logger = require('morgan');

var session = require('express-session');
var flash = require('connect-flash');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

var app = express();

// Insert database  
require('./config/connectDatabase')
require('./config/databaseSchema')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use moment
app.locals.moment = require('moment');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Adding cache css, js to improve page load
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '30 days' }));
app.use('/favicon.ico', express.static('images/favicon.ico'));
app.set('Cache-Control', 'max-age=3000');

//express-session middleware
app.use(
  session({
    name: 'Employee_Management',
    // proxy: true,
    resave: true,
    secret: "Employee_Management.secrect", // session secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false /*Use 'true' without setting up HTTPS will result in redirect errors*/,
    }
  })
);

//PassportJS middleware
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions

app.use(flash());

require('./config/passport')(passport, LocalStrategy);

require('./routes/index')(app);

app.use('*', (req, res, next) => {
  res.render('page404')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res.render('page404')
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  //res.render('page500')
});

module.exports = app;
