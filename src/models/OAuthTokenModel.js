/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 11/10/2023 20:15:14
 */
const mongoose = require('mongoose');
const OAuthClientModel = require('./OAuthClientModel');
const userModel = require('./userModel');
const Schema = mongoose.Schema;

const OAuthTokenSchema = new mongoose.Schema({
	accessToken: String,
	accessTokenExpiresAt: Date,
	client: {
		type: Schema.Types.ObjectId,
		ref: OAuthClientModel
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: userModel
	},
	'updated_at': Date,
	'created_at': { type: Date, default: new Date() },
});

module.exports = mongoose.model('OAuthToken', OAuthTokenSchema);
