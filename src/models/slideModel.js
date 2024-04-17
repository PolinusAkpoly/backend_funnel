/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 22/05/2023 11:59:19
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const slideSchema = new Schema({
	'title' : String,
	'description' : String,
	'button_text_one' : String,
	'button_link_one' : String,
	'button_text_two' : String,
	'button_link_two' : String,
	'imageUrl' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('slide', slideSchema);
