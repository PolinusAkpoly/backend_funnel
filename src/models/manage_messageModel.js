/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 25/06/2023 08:51:01
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const manage_messageSchema = new Schema({
	'messageId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'message'
	},
	'userId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'remove' : Boolean,
	'clear' : Boolean,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('manage_message', manage_messageSchema);
