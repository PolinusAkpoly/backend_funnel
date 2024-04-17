/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 07/10/2023 10:59:34
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visibilities = [
	"PRIVATE",
	"UNLISTED",
	"PUBLIC",
]

const videoSchema = new Schema({
	'name': String,
	'description': String,
	'filePath': String,
	'application': {
		type: Schema.Types.ObjectId,
		ref: 'application'
	},
	'author': {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	'visibility': {
		type: String,
		enum: visibilities,
		default: visibilities[0]
	},
	status: {
		type: String,
		enum: ['Priority', 'Pending', 'In Progress', 'Completed', "FileNotFound", "Error"],
		default: 'Pending',
	},
	'uniqueCode': String,
	'resolutionFiles': [],
	'posterFiles': [{ type: String }],
	'metadata': Object,
	'duration': String,
	'views': Number,
	'position': Number,
	'updated_at': Date,
	'created_at': { type: Date, default: new Date() },
	'created_formatted_with_time_since': String,
	'updated_formatted_with_time_since': String
});

module.exports = mongoose.model('video', videoSchema);
