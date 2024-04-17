/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 01/06/2023 09:10:48
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const newsletterSchema = new Schema({
	'fullName' : String,
	'email' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('newsletter', newsletterSchema);
