/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 23/05/2023 08:14:16
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const megaCollectionSchema = new Schema({
	'title' : String,
	'description' : String,
	'button_text' : String,
	'button_link' : String,
	'imageUrl' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('megaCollection', megaCollectionSchema);
