var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var validator = require('validator');
var response = require('../mechanisms/response.js');
var useragent = require('express-useragent');
var studentsBO = require('../business/students.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};

/** @description get students for room */
router.post('/rooms/:room', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.room === undefined) missingParameters.push("room");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		var device = req.useragent.Platform + " " + req.useragent.OS;

		return studentsBO.readForRoom(req.params.room, device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
			resolve(response);
		}).catch(function(err){
			res.status(err.code).json(err.json);
			reject(err);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/** @description  Get Students for Guardian */
router.get('/:student/guardians/:guardian', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.student === undefined) missingParameters.push("student");
		if (req.params.guardian === undefined) missingParameters.push("guardian");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		var device = req.useragent.Platform + " " + req.useragent.OS;

		return studentsBO.readForGuardian(req.params.student, req.params.guardian, device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
			resolve(response);
		}).catch(function(err){
			res.status(err.code).json(err.json);
			reject(err);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/** @description  Add Students for Guardian */
router.post('/:student/guardians/:guardian', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.student === undefined) missingParameters.push("student");
		if (req.params.guardian === undefined) missingParameters.push("guardian");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		var device = req.useragent.Platform + " " + req.useragent.OS;

		return studentsBO.addForGuardian(req.params.student, req.params.guardian, device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
			resolve(response);
		}).catch(function(err){
			res.status(err.code).json(err.json);
			reject(err);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});
/** @description  Remove Students for Guardian */
router.delete('/:student/guardians/:guardian', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.student === undefined) missingParameters.push("student");
		if (req.params.guardian === undefined) missingParameters.push("guardian");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		var device = req.useragent.Platform + " " + req.useragent.OS;

		return studentsBO.removeFromGuardian(req.params.student, req.params.guardian, device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
			resolve(response);
		}).catch(function(err){
			res.status(err.code).json(err.json);
			reject(err);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

module.exports = router;
