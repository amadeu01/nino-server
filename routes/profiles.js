/** @module routes/profiles */

var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var profileBO = require('../business/profiles.js');
var multiparty = require('multiparty');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(responses.invalidParameters("path_isNaN"));
	}
};

/**@description get my profile*/
router.get("/me", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			profileBO.getMyProfile(req.device, req.rawToken, req.token)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

router.put("/me", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			var profileInfo = {
				name: req.body.name,
				surname: req.body.surname,
				birthdate: req.body.birthdate,
				gender: req.body.gender
			};
			if (Object.keys(profileInfo).length === 0) resolve(responses.missingParameters("empty"));
			else profileBO.update(req.token.profile, profileInfo, req.device, req.rawToken, req.token)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**@description update profile */
router.put("/:profile_id", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			var profileInfo = {
				name: req.body.name,
				surname: req.body.surname,
				birthdate: req.body.birthdate,
				gender: req.body.gender
			};
			if (Object.keys(profileInfo).length === 0) resolve(responses.missingParameters("empty"));
			else profileBO.update(req.params.profile_id, profileInfo, req.device, req.rawToken, req.token)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/** @description create a new Profile
	Parameters:

	* Token
	* Name
	* Surname
	* ProfilePicture
	* BirthDate
	* Gender
	* Student
	* School
	* Class
	* Guardian
	* Room

	Returns:
	-----------
	{profile: ID,
	student?: ID}
*/
router.post("/", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.name === undefined ) missingParameters.push("name");
		if (req.body.surname === undefined) missingParameters.push("surname");
		if (req.body.birthdate === undefined) missingParameters.push("birthdate");
		if (req.body.gender === undefined ) missingParameters.push("gender");

		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			var profile = {
				name: req.body.name,
				surname: req.body.surname,
				birthdate: req.body.birthdate,
				gender: req.body.gender
			};
			profileBO.create(profile, req.device, req.rawToken, req.token)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**@description delete a profile
*/
router.delete("/:profile_id", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			profileBO.delete(req.params.profile_id, req.device, req.rawToken, req.token)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});


module.exports = router;
