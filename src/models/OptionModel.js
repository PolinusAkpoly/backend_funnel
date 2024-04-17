/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 29/02/2024 15:15:06
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const OptionSchema = new Schema({
	'name' : String,
	'value' : String,
	'position' : Number,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('Option', OptionSchema);
