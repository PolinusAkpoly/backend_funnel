/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 29/01/2024 12:09:18
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ServiceSchema = new Schema({
	'name' : String,
	'description' : String,
	'content' : String,
	'button_text' : String,
	'button_link' : String,
	'imageUrl' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('Service', ServiceSchema);
