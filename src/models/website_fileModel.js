/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 31/05/2023 18:50:51
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const website_fileSchema = new Schema({
	'name' : String,
	'fileUrl' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('website_file', website_fileSchema);
