/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 07/10/2023 11:02:14
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const videoResolutionSchema = new Schema({
	'name' : String,
	'description' : String,
	'size' : String,
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('videoResolution', videoResolutionSchema);
