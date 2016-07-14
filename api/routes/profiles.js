var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var profileBO = require('../business/profiles.js');
var validator = require('validator');
var multiparty = require('multiparty');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};


router.post("/me/picture", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			var form = new multiparty.Form();
			form.on('error', function(err) {
				reject(errors.internalError(err));
			});
			form.on('part', function(part) {
				if (part.name !== "picture") {
					part.resume();
					return;
				}
				gotImage = true;
				profileBO.uploadProfilePicture(token.profile, rawToken, req.device, part)
				.then(function(result) {
					res.status(result.code).json(result.json);
					resolve(result);
				})
				.catch(function(err) {
					res.status(err.code).json(err.json);
					resolve(err);
				});
			});
			form.on('close', function() {
				if (!gotImage) {
					reject(errors.missingParameters("picture"));
				}
			});
			form.parse(req);
		}
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

router.get("/profiles/:profile/picture", function(req, res, next) {
	
});

module.exports = router;
