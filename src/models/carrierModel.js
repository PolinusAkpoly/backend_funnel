/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 28/09/2023 09:18:45
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const carrierSchema = new Schema({
	'name' : String,
	'description' : String,
	'price' : Number,
	'imageUrl' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('carrier', carrierSchema);
