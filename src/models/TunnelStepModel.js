/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 28/01/2024 19:18:32
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const TunnelStepSchema = new Schema({
	'name' : String,
	'description' : String,
	'type' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'TunnelStepType'
	},
	'tunnelId' : {
		type: Schema.Types.ObjectId,
		ref: 'Tunnel'
   },
	'userId' : {
		type: Schema.Types.ObjectId,
		ref: 'User'
   },
   
	'order' : Number,
	'isActive' : Boolean,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('TunnelStep', TunnelStepSchema);
