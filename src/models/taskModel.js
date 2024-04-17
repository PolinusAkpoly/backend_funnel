/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 12/11/2023 08:12:40
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const taskSchema = new Schema({
	'timestamp' : Date,
	'ramUsage' : Number,
	'status' : String,
	'type' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('task', taskSchema);
