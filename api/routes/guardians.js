var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var validator = require('validator');
var guardiansBO = require('../business/guardians.js');
/*Check if parameter is valid id*/
var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};


/** @description Get list of Student's Guardians. */
router.get('/students/:student_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");

		if (req.body.guardian_id === undefined) missingParameters.push("guardian_id");
		//if (req.body.birthdate === undefined) missingParameters.push("birthdate");  //TODO: No need to check for birthdate, optional
		if (req.useragent.isBot === true ) reject(new response(400, "Bot", 1));

		else if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {

			return guardiansBO.findStudents(req.body.guardian_id, req.device, req.rawToken, req.token)
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

/** @description Get Guardian info*/
router.get('/:guardian_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");

		if (req.body.guardian_id === undefined) missingParameters.push("guardian_id");
		//if (req.body.birthdate === undefined) missingParameters.push("birthdate");  //TODO: No need to check for birthdate, optional
		if (req.useragent.isBot === true ) reject(new response(400, "Bot", 1));

		else if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {

			return guardiansBO.read(req.body.guardian_id, req.device, req.rawToken, req.token)
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

/*Delete a Guardian*/
router.delete('/:guardian_id', function(req, res, next) {

});

/** @description Add a Guardian to a Student */
router.post('/:guardian_id/students/:student_id', function(req, res, next) {

});

/** @description Delete the 'Guardianship' between a Guardian and a Baby*/
router.delete('/:guardian_id/students/:student_id', function(req, res, next) {

});

/** @description Create a new Guardian*/
router.post('/', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.email === undefined) missingParameters.push("email");
		//else if (req.body.cellphone === undefined); //-- not needed now, we dont use it yet
		if (req.body.name === undefined) missingParameters.push("name");
		if (req.body.surname === undefined) missingParameters.push("surname");
		if (req.body.student_id === undefined) missingParameters.push("student_id");
		//if (req.body.birthdate === undefined) missingParameters.push("birthdate");  //TODO: No need to check for birthdate, optional
		if (req.useragent.isBot === true ) reject(new response(400, "Bot", 1));

		else if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
		//Provided that all the needed parameters are there, we call business to validate them
			var account = {
				email: req.body.email,
				cellphone: req.body.cellphone
			};

			var profile = {
				name: req.body.name,
				surname: req.body.surname,
				birthdate: req.body.birthdate,
				gender: req.body.gender
			};
			return guardiansBO.create(account, profile, req.body.student_id, req.device, req.rawToken, req.token)
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
