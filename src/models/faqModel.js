/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 22/05/2023 15:40:57
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const faqSchema = new Schema({
	'title' : String,
	'content' : String,
	'isGeneral' : Boolean,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('faq', faqSchema);
