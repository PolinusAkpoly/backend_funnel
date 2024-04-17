/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 01/06/2023 15:37:06
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const shop_paramsSchema = new Schema({
	'name' : String,
	'description' : String,
	'currency' : String,
	'taxe_rate' : Number,
	'logo' : String,
	'street' : String,
	'city' : String,
	'code_postal' : String,
	'country' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('shop_params', shop_paramsSchema);
