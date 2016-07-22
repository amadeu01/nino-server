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

/** @description update profile's picture of current user
*/
router.put("/me/picture", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
			var gotImage = false;
			var form = new multiparty.Form();
			form.on('error', function(err) {
				reject(responses.internalError(err));
			});
			form.on('part', function(part) {
				if (part.name !== "picture") {
					part.resume();
					return;
				}
				gotImage = true;
				profileBO.uploadProfilePicture(token.profile, req.rawToken, req.device, part)
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
					reject(responses.missingParameters("picture"));
				}
			});
			form.parse(req);
		}
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/** @description get profile picture
*/
router.get("/:profile_id/picture", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.params.profile_id === undefined ) missingParameters.push("profile_id");


		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {


			return profileBO.getProfilePicture(req.params.profile_id, req.device, req.rawToken, req.token)
			.then(function(resp) {
				if (resp instanceof response) {
					res.status(resp.code).json(resp.json);
				} else {
					resp.pipe(res);
				}
			}).catch(function(err) {
				res.status(err.code).json(err.json);
			});
		}
	}).catch(function(err){
		//console.log(err);
		res.status(err.code).json(err.json);
	});
});

/**@description get my profile*/
router.get("/me", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");

		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {


			return profileBO.getMyProfile(req.device, req.rawToken, req.token)
			.then(function(resp) {
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).catch(function(err){
		//console.log(err);
		res.status(err.code).json(err.json);
	});
});

/**@description update profile */
router.put("/:profile_id", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");

		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
			var profileInfo = {
				name: req.body.name,
				surname: req.body.surname,
				birthdate: req.body.birthdate,
				gender: req.body.gender
			};

			return profileBO.update(profileInfo, req.device, req.rawToken, req.token)
			.then(function(resp) {
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).catch(function(err){
		//console.log(err);
		res.status(err.code).json(err.json);
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
		// if (req.school === undefined) missingParameters.push("school");
		// if (req.guardian === undefined) missingParameters.push("guardian");

		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
			var profile = {
				name: req.body.name,
				surname: req.body.surname,
				birthdate: req.body.birthdate,
				gender: req.body.gender
			};

			return profileBO.create(profile, req.device, req.rawToken, req.token)
			.then(function(resp) {
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).catch(function(err){
		//console.log(err);
		res.status(err.code).json(err.json);
	});
});

/**@description update a profile picture of an user
*/
router.put("/:profile_id/picture", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.params.profile_id === undefined ) missingParameters.push("name");


		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {

			return profileBO.updateProfilePicture(req.params.profile_id, req.device, req.rawToken, req.token)
			.then(function(resp) {
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).catch(function(err){
		//console.log(err);
		res.status(err.code).json(err.json);
	});
});

/**@description delete a profile
*/
router.put("/:profile_id", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.params.profile_id === undefined ) missingParameters.push("name");


		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {

			return profileBO.delete(req.params.profile_id, req.device, req.rawToken, req.token)
			.then(function(resp) {
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).catch(function(err){
		//console.log(err);
		res.status(err.code).json(err.json);
	});
});


module.exports = router;
