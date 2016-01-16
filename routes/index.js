var express = require('express');
var router = express.Router();
var API = require('../lib/API.js');

router.use('/', function(req, res, next) {
	next();
});

router.get('/probe/:shortId', function(req, res, next) {
	
	if (!req.params.shortId) {
		res.end();
		return;
	}

	API.probe(req.params.shortId, function(error, response) {
		if (error) {
			return next(error);
		}
		res.json(response);
	});
});
router.get('/:shortId', function(req, res, next) {
	API.get({
		shortId: req.params.shortId
	}, function(error, response) {
		if (error) {
			return next(error);
		}
		res.redirect(302, response.originalPath);
	});
});
router.post('/', function(req, res, next) {

	var details = {
		'originalPath': req.body.originalPath
	};
	if (req.body.userShortId) {
		details.userShortId = req.body.userShortId;
		API.probe(req.body.userShortId, function(error, response) {
			if (error) {
				return next(error);
			}
			if (response.exists) {
				return next(new Error());
			}
			API.post(details, function(err, response) {
				if (err) {
					return next(err);
				}
				res.json(response);
			});
		});
		return;
	}
	API.post(details, function(err, response) {
		if (err) {
			return next(err);
		}

		res.json(response);
	});
});

module.exports = router;