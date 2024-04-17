/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 02/08/2023 17:04:12
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const types = [
	"LIKE",
	"HEART",
	"SOLIDARITY",
	"HAHA",
	"WAHOU",
	"SAD",
	"ANGRY",
]

const post_feedbackSchema = new Schema({
	'type' :  {
		type: String,
		enum: types,
		default: types[0]
	},
	'postId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'post'
	},
	'author' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('post_feedback', post_feedbackSchema);
