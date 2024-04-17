/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 13:15:06
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const commentSchema = new Schema({
	'postId' : {
	'ownership' : {
	'content' : String,
	'comments' : {
	'position' : Number,
	'updated_at' : Date,
	'created_at' : {type: Date, default: new Date()},
	'created_formatted_with_time_since' : String,
	'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('comment', commentSchema);