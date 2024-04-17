/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 31/05/2023 16:42:42
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const email_templateSchema = new Schema({
	'title' : String,
	'subject' : String,
	'content' : String,
	'code' : String,
	'fileUrls' : [{
		type: Schema.Types.ObjectId,
		ref: 'website_file'
	}],
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('email_template', email_templateSchema);
