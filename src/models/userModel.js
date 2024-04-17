/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 18:35:24
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roles = [
	"ROLE_USER",
	"ROLE_ADMIN",
]

const userSchema = new Schema({
	civility: { type: String },
	firstname: { type: String},
	lastname: { type: String },
	fullname: { type: String },
	username: { type: String },
	website: { type: String },
	publicinfo: { type: String },
	email: { type: String, required: true },
	phone: { type: String, required: false },
	password: { type: String, required: true },
	mutual_friend_count: Number,
	has_friend_request: Boolean,
	friend_count: {type: Number, default: 0},
	is_my_friend: {type: Boolean, default: false},
	request_received: {type: Boolean, default: false},
	request_sended: {type: Boolean, default: false},
	roles: [{
		type: String,
		enum: roles,
		default: roles[0]
	}],
	addresses: [{
		type: Schema.Types.ObjectId,
		ref: 'address'
	}],
	profile: {
		type: Schema.Types.ObjectId,
		ref: "profile"
	},
	friends: {
		type: Schema.Types.ObjectId,
		ref: "user"
	},
	tags: Array,
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: String
	},
	verifyAccountToken: {
		type: String
	},
	googleId: {
		type: String
	},
	facebookId: {
		type: String
	},
	twiterId: {
		type: String
	},
	verifyAccountExpires: {
		type: String
	},
	lastConnected: { type: Date },
	online: {
		type: Boolean,
		default: false
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	receivePromoMessage: {
		type: Boolean,
		default: false
	},
	position: Number,
	updated_at: Date,
	created_at: { type: Date, default: new Date() },
	created_formatted_with_time_since: String,
	updated_formatted_with_time_since: String
});

module.exports = mongoose.model("user", userSchema);
