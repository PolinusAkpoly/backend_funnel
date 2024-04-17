/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 12/10/2023 17:54:30
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const OAuthClientSchema = new Schema({
	'clientName' : String,
	'description' : String,
	'author' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'clientId' : String,
	'clientSecret' : String,
	'grants' : Array,
	'origins' : {type: Array, default: []},
	'redirectUris' : Array,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('OAuthClient', OAuthClientSchema);
