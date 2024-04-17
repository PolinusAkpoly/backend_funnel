/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 05/05/2023 20:22:46
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const productSchema = new Schema({
	'name' : String,
	'slug' : String,
	'description' : String,
	'more_description' : String,
	'additional_infos' : String,
	'stock' : Number,
	'solde_price' : Number,
	'regular_price' : Number,
	'categories' :[ {
	 	type: Schema.Types.ObjectId,
	 	ref: 'category'
	}],
	'relatedProducts' :[ {
	 	type: Schema.Types.ObjectId,
	 	ref: 'product'
	}],
	'reviews' :[ {
	 	type: Schema.Types.ObjectId,
	 	ref: 'review'
	}],
	'brand' : String,
	'imageUrls' : Array,
	'status' : {type: Boolean, default: false},
	'isBestSeller' : {type: Boolean, default: false},
	'isNewArrival' : {type: Boolean, default: false},
	'isFeatured' : {type: Boolean, default: false},
	'isSpecialOffer' : {type: Boolean, default: false},
	'availability' : {type: Boolean, default: true},
	'options' : Array,
	'currency' : {type:String, default: "EUR"},
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('product', productSchema);
