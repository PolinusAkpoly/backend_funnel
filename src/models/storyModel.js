/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 12:54:14
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const storySchema = new Schema({
	'ownership' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'fileUrls' : Array,
	'content' : String,
	'color' : String,
	'type' : String,
	'userView' : [{
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	}],
	'views' : Number,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('story', storySchema);
