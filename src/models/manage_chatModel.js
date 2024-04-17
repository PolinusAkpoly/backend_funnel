/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 25/06/2023 08:48:17
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const manage_chatSchema = new Schema({
	'chatId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'chat'
	},
	'userId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'archive' : {type: Boolean, default: false},
	'remove' : {type: Boolean, default: false},
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('manage_chat', manage_chatSchema);
