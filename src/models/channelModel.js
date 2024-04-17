/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 10/10/2023 14:47:42
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const channelSchema = new Schema({
	'name' : String,
	'description' : String,
	'coverImageUrl' : String,
	'position' : Number,
	'author' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
   },
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('channel', channelSchema);
