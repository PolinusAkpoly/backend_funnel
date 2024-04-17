/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 29/05/2023 14:05:59
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const available_paymentSchema = new Schema({
	'name' : String,
	'description' : String,
	'isAvailable' : {type: Boolean, default: false},
	'imageUrl' : String,
	'options' : Array,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('available_payment', available_paymentSchema);
