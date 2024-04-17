/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 26/11/2023 18:11:04
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientDataSchema = new Schema({
	clientIp: String,
	browser: String,
	os: String,
	device: String,
	acceptLanguage: String,
	country: String,
	city: String,
	latitude: String,
	longitude: String,
	origin: String,
	'position': Number,
	'updated_at': Date,
	'created_at': { type: Date, default: new Date() },
	'created_formatted_with_time_since': String,
	'updated_formatted_with_time_since': String
});

module.exports = mongoose.model('clientData', clientDataSchema);
