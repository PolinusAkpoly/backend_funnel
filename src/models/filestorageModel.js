/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 15/02/2024 18:15:05
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const filestorageSchema = new Schema({
	'name' : String,
	'link' : String,
	'type' : String,
	'userId' : {	 	type: Schema.Types.ObjectId,	 	ref: 'User'	},
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('filestorage', filestorageSchema);
