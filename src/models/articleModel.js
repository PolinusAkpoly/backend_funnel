/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 09/05/2023 18:28:17
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const articleSchema = new Schema({
	'title' : String,
	'description' : String,
	'imageUrl' : String,
	'author' : {	 	type: Schema.Types.ObjectId,	 	ref: 'user'	},
	'content' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('article', articleSchema);
