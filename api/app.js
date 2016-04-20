var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');
var jwt = require('jsonwebtoken');

var app = express();
module.exports = app;

var students = require('./routes/students');
var educators = require('./routes/educators');
var credentials = require('./routes/credentials');
var devices = require('./routes/devices');
var guardians = require('./routes/guardians');
var schools = require('./routes/schools');
var subscriptions = require('./routes/subscriptions');
var timeline = require('./routes/timeline');
var rooms = require('./routes/classes');
var classes = require('./routes/rooms');

var services = require('./services');

// var services = require ('./services');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('sha256Secret', 'beckedanilowhoftw');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(useragent.express());

// Allow CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
	// res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

// Gets user
app.use(function(req, res, next) {
	// console.log(req.useragent);
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp - Gets params and proceed! <-TODO
		services.jwt.validate(token)
		.then(function(decoded) {
			// console.log(decoded);
			req.token = decoded;
	    next();
		})
		.catch(function(error) {
			// console.log(error);
			next();
		});
  } else {
		next();
	}
});

app.use('/students', students);
app.use('/educators', educators); 
app.use('/credentials', credentials);
app.use('/devices', devices);
app.use('/guardians', guardians);
app.use('/schools', schools);
app.use('/subscriptions', subscriptions);
app.use('/timeline', timeline);
app.use('/classes', classes);
app.use('/rooms', rooms);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
