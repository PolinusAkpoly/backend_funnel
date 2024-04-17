/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 11/06/2023 19:31:47
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const messageSchema = new Schema({
	'chatId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'chat'
	},
	'content' : String,
	'type' : {
        type: String,
        enum: ['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'APPLICATION'],
        default: 'TEXT'
    },
	'ownership' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'sender' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'fileUrls' : {type: Array, default: []},
	'isRead' : Boolean,
	'shared' : {type: Boolean, default: false},
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('message', messageSchema);
