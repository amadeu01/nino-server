var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var profileBO = require('../business/profiles.js');
var validator = require('validator');

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
		if (req.body.picture === undefined) missingParameters.push("picture");
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			profileBO.uploadProfilePicture(token.profile, rawToken, req.device, req)
			.then(function(result) {
				res.status(result.code).json(result.json);
				resolve(result);
			})
			.catch(function(err) {
				res.status(err.code).json(err.json);
				resolve(err);
			});
		}
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

router.get("/profiles/:profile/picture", function(req, res, next) {
	
});

module.exports = router;
