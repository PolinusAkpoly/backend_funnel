/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 11/06/2023 19:35:08
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
	'participants': [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	'lastMessage': {
		type: Schema.Types.ObjectId,
		ref: 'message'
	},
	'unReadMessageCount': {type: Number, default: 0},
	'position': Number,
	'updated_at': Date,
	'created_at': { type: Date, default: new Date() },
	'created_formatted_with_time_since': String,
	'updated_formatted_with_time_since': String
});

module.exports = mongoose.model('chat', chatSchema);
