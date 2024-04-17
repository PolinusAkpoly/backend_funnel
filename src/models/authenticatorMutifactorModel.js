var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var authenticatorMutifactorSchema = new Schema({
	'userId' : String,
	'partial_token' : String,
	'code' : String,
	'expiredAt' : Date,
	'createdAt' : Date
});

module.exports = mongoose.model('authenticatorMutifactor', authenticatorMutifactorSchema);
