/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 15/10/2023 12:14:16
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const webinaireSchema = new Schema({
	'title' : String,
	'description' : String,
	'author' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'video' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'video'
	},
	'code' : String,
	'started_at' : Date,
	'duration' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('webinaire', webinaireSchema);
