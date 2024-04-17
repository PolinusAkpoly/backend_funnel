/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 22/05/2023 13:56:11
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const collectionSchema = new Schema({
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

module.exports = mongoose.model('collection', collectionSchema);
