
var express = require('express');
var createError = require('http-errors');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
var config = require('./config'); //configuration for MongoDB, Secret key and client url
const mongoose = require('mongoose');
const connect = mongoose.connect(config.mongoUrl);

var indexRouter = require('./routes/index'); //for server page
var usersRouter = require('./routes/users'); //for user authentication	
var chatRouter = require('./routes/chatRouter'); //for chatroom page

connect.then((db) => {
	console.log("Connection to mongoDb server successful");
}, (err) => { console.log(err); });

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// const corsOpts = {
// 	origin: config.clientURL,
// };
// app.use(cors(corsOpts));

app.use(logger('dev'));  // use for logging api requests coming from client
app.use(express.json());
app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chats', chatRouter);
app.use(express.static(path.join(__dirname, 'public'))); //serve static data from the public folder

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404)); //modified object passes to next code snippet
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
