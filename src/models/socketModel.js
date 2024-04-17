/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 17/06/2023 09:12:24
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const socketSchema = new Schema({
	'socketId' : {
		type: String,
		unique: true,
	},
	'userId': {
        type: Schema.Types.ObjectId,
		ref: 'user'
	},
    'address' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('socket', socketSchema);
