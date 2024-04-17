/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 07/10/2023 10:56:14
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
	'name': String,
	'description': String,
	'author': {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	clientId: String,
	clientSecret: String,
	'updated_at': Date,
	'created_at': { type: Date, default: new Date() },
	'created_formatted_with_time_since': String,
	'updated_formatted_with_time_since': String
});

module.exports = mongoose.model('application', applicationSchema);
