/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 12:48:19
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const business_pageSchema = new Schema({
	'name' : String,
	'description' : String,
	'address' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'address'
	},
	'hours' : Object,
	'coverImageUrl' : String,
	'profileImageUrl' : String,
	'viewCounts' : Number,
	'suscribers' : [
		{
			type: Schema.Types.ObjectId,
			ref: 'user'
	   }
	],
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('business_page', business_pageSchema);
