/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 13:17:46
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const feedbackSchema = new Schema({
	'name' : String,
	'value' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('feedback', feedbackSchema);
