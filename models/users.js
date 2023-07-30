var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({});

userSchema.plugin(passportLocalMongoose); // this plugin automatically adds username field and hashed password

module.exports = mongoose.model('User', userSchema);