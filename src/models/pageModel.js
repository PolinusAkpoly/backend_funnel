/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 05/05/2023 19:20:01
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
	'name': String,
	'slug': String,
	'content': String,
	'options': Object,
	'isTop': { type: Boolean, default: false },
	'isPublished': { type: Boolean, default: false },
	'isBottom': { type: Boolean, default: false },
	'position': Number,
	'updated_at': Date,
	'created_at': { type: Date, default: new Date() },
	'created_formatted_with_time_since': String,
	'updated_formatted_with_time_since': String
});

module.exports = mongoose.model('page', pageSchema);
