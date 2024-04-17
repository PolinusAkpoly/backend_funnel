/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 30/05/2023 09:03:29
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const types = [
	"SHIPPING",
	"BILLING",
]

const addressSchema = new Schema({
	'name' : String,
	'street' : String,
	'city' : String,
	'state' : String,
	'code_postal' : String,
	'address_type' : {
		type: String,
		enum: types,
		default: types[0]
	},
	'user' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	'phone' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('address', addressSchema);
