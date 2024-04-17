/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 05/05/2023 20:19:03
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify')

const categorySchema = new Schema({
	'name': String,
	'slug': String,
	'description': String,
	'isMega': { type: Boolean, default: false },
	'position': Number,
	'author' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
   },
	'products': Array,
	'updated_at': Date,
	'created_at': { type: Date, default: new Date() },
	'created_formatted_with_time_since': String,
	'updated_formatted_with_time_since': String
});
// Méthode pour générer un slug à partir du nom de la catégorie
categorySchema.methods.generateSlug = function () {
	this.slug = slugify(this.name, { lower: true });
};

// Middleware (hook) pour générer le slug avant la sauvegarde
categorySchema.pre('save', function (next) {
	if (!this.slug) {
		this.generateSlug();
	}
	next();
});
module.exports = mongoose.model('category', categorySchema);
