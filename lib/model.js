var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlShorteningSchema = new Schema({
	shortId: {
		type: String,
		unique: true,
		required: true
	},
	originalPath: {
		type: String,
		required: true
	}
});
module.exports = UrlShorteningSchema;