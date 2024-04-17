/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 05/05/2023 19:21:59
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const orderSchema = new Schema({
	'clientName' : String,
	'priceHT' : Number,
	'priceTTC' : Number,
	'taxe' : Number,
	'quantity' : Number,
	'total' : Number,
	'isPaid' : {type: Boolean, default: false},
	'billingAddress' : Object,
	'shippingAddress' : Object,
	'carrier' : Object,
	// stripe
	'payment_intent' : String,
	// paypal
	'carrier_price' : String,
	'carrier_name' : String,
	'paypal_order_id' : String,
	'payment_method' : String,
	'order_details' : [{
	 	type: Schema.Types.ObjectId,
	 	ref: 'orderdetail'
	}],
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('order', orderSchema);
