/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 21/10/2023 09:25:53
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const authstrategySchema = new Schema({
	'name' : String,
	'description' : String,
	'clientId' : String,
	'clientSecret' : String,
	'callbackURL' : String,
	'code' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('authstrategy', authstrategySchema);
