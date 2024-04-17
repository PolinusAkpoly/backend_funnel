/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 29/02/2024 15:20:41
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const FormuleSchema = new Schema({
	'name' : String,
	'options': Object,
	'button_link' : String,
	'button_text' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('Formule', FormuleSchema);
