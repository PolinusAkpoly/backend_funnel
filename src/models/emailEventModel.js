/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 15/10/2023 10:28:45
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const emailEventSchema = new Schema({
	'name' : String,
	'template' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('emailEvent', emailEventSchema);
