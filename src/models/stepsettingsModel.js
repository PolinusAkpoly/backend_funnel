/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 03/02/2024 20:25:10
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Schéma pour le modèle 'Template'
const templateSchema = new Schema({
	type: String,
	content: String,
	src: String,
	alt: String,
	position: Number,
	columnIndex: Number,
	containerStyles: Object,
	styles: Object
});

// Schéma pour le modèle 'Block'
const blockSchema = new Schema({
    position: Number,
    columnCount: Number,
    container: String,
    templates: [templateSchema],
    containerStyles: Object,
    styles: Object
});




const stepsettingsSchema = new Schema({
	'name': String,
	'description': String,
	'urlPath': String,
	'stepId': {
		type: Schema.Types.ObjectId,
		ref: 'step'
	},
	'tunnelId': {
		type: Schema.Types.ObjectId,
		ref: 'Tunnel'
	},
	'userId': {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	'blocks': [blockSchema],
	'position': Number,
	'updated_at': Date,
	'created_at': { type: Date, default: new Date() },
	'created_formatted_with_time_since': String,
	'updated_formatted_with_time_since': String
});

module.exports = mongoose.model('stepsettings', stepsettingsSchema);
