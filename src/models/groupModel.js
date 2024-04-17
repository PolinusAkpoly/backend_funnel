/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 12:44:17
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const groupSchema = new Schema({
	'name' : String,
	'description' : String,
	'author' : {	 	type: Schema.Types.ObjectId,	 	ref: 'user'	},
	'admin' : Array,
	'coverImageUrl' : String,
	'profileImageUrl' : String,
	'participants' : Array,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('group', groupSchema);
