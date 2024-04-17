/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 31/05/2023 16:58:00
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const email_paramaterSchema = new Schema({
	'name' : String,
	'username' : String,
	'password' : String,
	'output_server' : String,
	'port_output_server' : String,
	'input_server' : String,
	'port_input_server' : String,
	'protocol' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('email_paramater', email_paramaterSchema);
