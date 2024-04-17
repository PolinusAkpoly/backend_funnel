/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 22/05/2023 14:37:22
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const metaSchema = new Schema({
	'name' : String,
	'value' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('meta', metaSchema);
