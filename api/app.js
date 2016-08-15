var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');

var app = express();
module.exports = app;

var responses = require('./mechanisms/responses.js');
var accounts = require('./routes/accounts');
var activities = require('./routes/activities');
var classes = require('./routes/classes');
var drafts = require('./routes/drafts');
var employees = require('./routes/employees');
var events = require('./routes/events');
var guardians = require('./routes/guardians');
var menus = require('./routes/menus');
var posts = require('./routes/posts');
var profiles = require('./routes/profiles');
var rooms = require('./routes/rooms');
var schools = require('./routes/schools');
var students = require('./routes/students');
var contents = require('./routes/contents');

var jwt = require('./mechanisms/jwt');

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
	var device = req.useragent.platform + " " + req.useragent.os;
	if (device) {
		req.device = device;
	} // TODO: should throw error, cause there is no device ?!
	//console.log(req.useragent);
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp - Gets params and proceed! <-TODO
		req.rawToken = token;
		jwt.validate(token)
		.then(function(decoded) {
			req.token = decoded;
	    next();
		})
		.catch(function(error) {
			var resp;
			if (error.name === "TokenExpiredError") {
				resp = responses.expiredCredential(error.expiredAt);
			} else {
				resp = responses.invalidCredential(error.message);
			}
			res.status(resp.code).json(resp.json);
			//Failed to decode jwt, returns error
		});
  } else {
		next();
	}
});

app.use('/accounts', accounts);
// app.use('/activities', activities);
app.use('/classes', classes);
app.use('/drafts', drafts);
app.use('/employees', employees);
// app.use('/events', events);
app.use('/guardians', guardians);
// app.use('/menus', menus);
app.use('/posts', posts);
app.use('/profiles', profiles);
app.use('/rooms', rooms);
app.use('/schools', schools);
app.use('/students', students);
app.use('/contents', contents);


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
