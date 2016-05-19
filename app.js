process.stdout.write("Starting server...");

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index.js');
var devices = require('./routes/devices.js');

var app = express();

// Device connection code
var sockPort = 11111;

process.stdout.write('loading socket...');
var devs = require('./devices.js');

process.stdout.write('loading database...');
var base = require('./base.js');
var db = new base('localhost', 'oso');

var deviceServer = new devs(sockPort, db);

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());

app.use('/', routes);
app.use('/devices', devices);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/static', express.static(__dirname + '/public'));

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


module.exports = app;
console.log('done.');
