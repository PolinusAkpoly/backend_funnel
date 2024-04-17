/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 24/10/2023 18:01:59
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentationSchema = new Schema({
	'title': String,
	'slug': String,
	'description': String,
	'sections': Object,
	'position': Number,
	'updated_at': Date,
	'created_at': { type: Date, default: new Date() },
	'created_formatted_with_time_since': String,
	'updated_formatted_with_time_since': String
});

documentationSchema.pre('save', function (next) {
	if (this.isNew || this.isModified('title')) {
		this.slug = slugify(this.title);
	}
	next();
});

function slugify(text) {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Remplace les espaces par des tirets
		.replace(/[^\w-]+/g, '') // Supprime les caractères non alphanumériques sauf les tirets
		.replace(/^-+/, '') // Supprime les tirets au début
		.replace(/-+$/, ''); // Supprime les tirets à la fin
}

module.exports = mongoose.model('documentation', documentationSchema);
