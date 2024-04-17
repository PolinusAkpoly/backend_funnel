/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 04/06/2023 11:06:19
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const reviewSchema = new Schema({
	'userId' : {	 	type: Schema.Types.ObjectId,	 	ref: 'user'	},
	'productId' : {	 	type: Schema.Types.ObjectId,	 	ref: 'product'	},
	'rate' : Number,
	'comment' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('review', reviewSchema);
