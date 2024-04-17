/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 01/03/2024 11:01:42
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const AvantageSchema = new Schema({
	'name' : String,
	'formules' : [{
	 	type: Schema.Types.ObjectId,
	 	ref: 'Formule'
	}],
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('Avantage', AvantageSchema);
