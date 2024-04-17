/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 21:28:13
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const fileSchema = new Schema({
	name : String,
	type : String,
	fileUrl : String,
	author : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	position  : Number,
	updated_at  : Date,
	created_at  : {type: Date, default: new Date()},
	created_formatted_with_time_since  : String,
	updated_formatted_with_time_since  : String
});

module.exports = mongoose.model("file", fileSchema);
