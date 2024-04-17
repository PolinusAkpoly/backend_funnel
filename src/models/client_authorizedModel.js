/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 29/09/2023 17:11:13
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const client_authorizedSchema = new Schema({
	'name' : String,
	'link' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('client_authorized', client_authorizedSchema);
