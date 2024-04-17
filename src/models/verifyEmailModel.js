var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var verifyEmailSchema = new Schema({
	'userId' : String,
	'partial_token' : String,
	'code' : String,
	'isVerified' : {type: Boolean, default: false},
	'reset_password_token' : String,
	'expiredAt' : Date,
	'createdAt' : Date
});

module.exports = mongoose.model('verifyEmail', verifyEmailSchema);
