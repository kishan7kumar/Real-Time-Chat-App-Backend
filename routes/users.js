
var express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
var passport = require('passport');
const cors = require('./cors');
var User = require('../models/users');
var usersRouter = express.Router();
usersRouter.use(bodyParser.json());

usersRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); }) //useful for post operations sending options first
usersRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
	User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
		if (err) {
			res.statusCode = 403;
			res.setHeader('Content-Type', 'application/json');
			res.json({ err: err });
		}
		else {
			passport.authenticate('local')(req, res, () => {
				var token = authenticate.getToken({ _id: user._id });
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({ success: true, token: token, status: 'Registration Successful!' });
			});
		}
	});
});


usersRouter.post('/login', cors.corsWithOptions, (req, res, next) => {
	//here info has error like username does not exist or username password did not match
	passport.authenticate('local', { session: false }, (err, user, info) => {
		// if error in authentication
		if (err) {
			return next(err);
		}
		// if user not found or password incorrect 
		else if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({ success: false, status: 'User Login Unsuccessful!', err: info });
		}
		else {
			// if user is found in database and can be logged in. Passport add login method here
			req.login(user, { session: false }, (err) => {
				if (err) {
					res.statusCode = 401;
					res.setHeader('Content-Type', 'application/json');
					res.json({ success: false, status: 'User Login Unsuccessful!', err: 'Cannot login user!' });
				}
				else {
					var token = authenticate.getToken({ _id: req.user._id });
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({ success: true, status: 'User Login Successful!', token: token });
				}
			});
		}
	})(req, res, next);
});

usersRouter.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err) {
			return next(err);
		}
		else if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			return res.json({ status: 'JWT token is invalid or expired', success: false, err: info });
		}
		else {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			return res.json({ status: 'JWT token is valid', success: true, user: user });
		}
	})(req, res);
});


module.exports = usersRouter;
