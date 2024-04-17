/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 11:08:06
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const visibilities = [
	"PUBLIC",
	"FRIENDS",
	"PRIVATE",
]

const postSchema = new Schema({
	'content' : String,
	'type' : String,
	'shared' : Boolean,
	'ownership' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'fileUrls' : Array,
	'with_friends' : [{
		type: Schema.Types.ObjectId,
		ref: 'user'
   }],
	'views' : Number,
	'comment_count' : {type: Number, default: 0},
	'visibility' :{
		type: String,
		enum: visibilities,
		default: visibilities[0]
	},
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('post', postSchema);
