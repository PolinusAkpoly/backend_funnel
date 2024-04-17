/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 29/07/2023 15:01:18
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const status = [
	"ASQ",
	"ACCEPT",
	"DELETE",
]

const friend_requestSchema = new Schema({
	'ownerId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'senderId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	status: {
		type: String,
		enum: status,
		default: status[0]
	},
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('friend_request', friend_requestSchema);
