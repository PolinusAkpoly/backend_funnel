/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 31/01/2024 09:57:30
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateFileSchema = new mongoose.Schema({
	fileName: { type: String, required: true },
	fileType: { type: String, required: true },
	content: { type: String, required: true },
});

const TemplateSchema = new Schema({
	'name': String,
	'description': String,
	'imageUrl': String,
	'templateUrl': String,
	'uniquePrefix': String,
	'files': [templateFileSchema],
	'position': Number,
	'updated_at': Date,
	'created_at': { type: Date, default: new Date() },
	'created_formatted_with_time_since': String,
	'updated_formatted_with_time_since': String
});

module.exports = mongoose.model('Template', TemplateSchema);
