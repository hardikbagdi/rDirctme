var model = require('./model.js');
var randomstring = require('randomstring');
var mongoose = require('mongoose');
var UrlModel = mongoose.model('URL', model);
mongoose.connect(process.env['DB_PATH']);
var API = {};

function probe(uniqueId, callback) {
	// body...
	UrlModel.count({
		'shortId': uniqueId
	}, function(err, count) {

		if (err) {
			return callback(err);
		}
		if (count === 0) {
			callback(null, {
				'exists': false
			});
		} else {
			callback(null, {
				'exists': true
			});
			// return {'exists': true};
		}
	});
}

function get(details, callback) {
	if (details === null || details.shortId === null) {
		var error = new Error();
		error.status = 404;
		callback(error);
		callback(error);
	}
	UrlModel.findOne({
		'shortId': details.shortId
	}, function(err, urlfound) {
		if (urlfound === null) {
			var error = new Error();
			error.status = 404;
			return callback(error,null);
		} else {
			return callback(null, urlfound);
		}
	});
}

function saveWithId(details, callback) {
	var UrlToSave = new UrlModel();
	UrlToSave.originalPath = details.originalPath;
	UrlToSave.shortId = details.userShortId;
	UrlToSave.save(function(err, result) {
		if (err) {
			return callback(err);
		}
		callback(null, {
			'inserted': true,
			'details': {
				'originalPath': result.originalPath,
				'shortId': result.shortId
			}
		});
	});
}

function post(details, callback) {
	if (details === null || details.originalPath === null) {
		var error = new Error();
		error.status = 404;
		callback(error);
	}
	if (details.userShortId) {
		return saveWithId(details, callback);
	}
	var UrlToSave = new UrlModel();
	var uniqueId = randomstring.generate(6);
	UrlModel.count({
		'shortId': uniqueId
	}, function(err, count) {
		if (count == 1) {
			post(details, callback);
		} else if (count === 0) {
			UrlToSave.originalPath = details.originalPath;
			UrlToSave.shortId = uniqueId;
			UrlToSave.save(function(err, result) {
				if (err) {
					return callback(err);
				}
				callback(null, {
					'inserted': true,
					'details': {
						'originalPath': result.originalPath,
						'shortId': result.shortId
					}
				});
			});
		} else {
			//handle inconsistent state
		}
	});
}
API.get = get;
API.post = post;
API.probe = probe;

module.exports = API;