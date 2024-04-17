/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 14/06/2023 17:08:10
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
	business_name: String,
	function: String,
	description: String,
	address: String,
	street: String,
	code_postal: String,
	city: String,
	state: String,
	hours: Object,
	website: String,
	picture: String,
	cover_picture: String,
	visibility: String,
	dayBirth: Number,
	monthBirth: Number,
	yearBirth: Number,
	friend_count: {type: Number, default: 0},
	user: {
		type: Schema.Types.ObjectId,
		ref: "user"
	},
	categories: {
		type: Schema.Types.ObjectId,
		ref: "category"
	},
	'position': Number,
	'updated_at': Date,
	'created_at': { type: Date, default: new Date() },
	'created_formatted_with_time_since': String,
	'updated_formatted_with_time_since': String
});

module.exports = mongoose.model('profile', profileSchema);
