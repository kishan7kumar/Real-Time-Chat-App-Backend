var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js');
var User = require('./models/users');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // for storing user sessions
passport.deserializeUser(User.deserializeUser()); // retreiveing user information from session

// function to create token
exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey,
        { expiresIn: 4200 });
};

var opts = {}; //options for passport-jwt
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //extracts information from headers
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false); //error and no user
            }
            else if (user) {
                return done(null, user); // user found
            }
            else {
                return done(null, false); // no error and no user 
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', { session: false }); //session false means no session created here bcs token based authentication used



