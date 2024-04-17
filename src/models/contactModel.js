/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 21:49:48
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const contactSchema = new Schema({
	subject : String,
	email : String,
	content : String,
	status : String,
	position  : Number,
	updated_at  : Date,
	created_at  : {type: Date, default: new Date()},
	created_formatted_with_time_since  : String,
	updated_formatted_with_time_since  : String
});

module.exports = mongoose.model("contact", contactSchema);
