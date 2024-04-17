/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 31/01/2024 10:22:55
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const navitemSchema = new Schema({
	'name' : String,
	'key' : String,
	'path' : String,
	'icon' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('navitem', navitemSchema);
