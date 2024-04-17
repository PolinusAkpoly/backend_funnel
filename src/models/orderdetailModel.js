/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 06:35:41
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const orderdetailSchema = new Schema({
	product_name : String,
	product_image : String,
	product_description : String,
	product_more_description : String,
	product_regular_price : Number,
	product_solde_price : Number,
	quantity : Number,
	total : Number,
	position  : Number,
	updated_at  : Date,
	created_at  : {type: Date, default: new Date()},
	created_formatted_with_time_since  : String,
	updated_formatted_with_time_since  : String
});

module.exports = mongoose.model("orderdetail", orderdetailSchema);
