var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var validator = require('validator');
var response = require('../mechanisms/response.js');
var studentsBO = require('../business/students.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};

/** @description get students for room */
router.get('/rooms/:room_id/schools/school_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.room_id === undefined) missingParameters.push("room_id");
		if (req.params.school_id === undefined) missingParameters.push("school_id");
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			return studentsBO.readForRoom(req.params.room_id, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/** @description  Get Students for Guardian
 * @deprecated
 */
router.get('/:student_profile_id/guardians/:guardian_profile_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.student_id === undefined) missingParameters.push("student");
		if (req.params.guardian_profile_id === undefined) missingParameters.push("guardian");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			return studentsBO.readForGuardian(req.params.guardian_profile_id, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/** @description  Get Students for Guardian */
router.get('/guardians/:guardian_profile_id/schools/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.params.guardian_profile_id === undefined) missingParameters.push("guardian");
		if (req.params.school_id === undefined) missingParameters.push("school_id");
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			return studentsBO.readForGuardian(req.params.school_id, req.params.guardian_profile_id, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/** @description  Add Students for Guardian */
router.post('/:student_profile_id/guardians/:guardian_profile_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.student_profile_id === undefined) missingParameters.push("student");
		if (req.params.guardian_profile_id === undefined) missingParameters.push("guardian");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			return studentsBO.addForGuardian(req.params.student_profile_id, req.params.guardian_profile_id, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}

	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});
/** @description  Create student to school */
router.post('/schools/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.school_id === undefined) missingParameters.push("school_id");
		if (req.body.room_id === undefined) missingParameters.push("room_id");
		if (req.body.name === undefined) missingParameters.push("name");
		if (req.body.surname === undefined) missingParameters.push("surname");
		if (req.body.birthdate === undefined) missingParameters.push("birthdate");
		if (req.body.gender === undefined) missingParameters.push("gender");
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			var student_profile = {
				name: req.body.name,
			  surname: req.body.surname,
				birthdate: req.body.birthdate,
				gender: req.body.gender
			};

			return studentsBO.create(student_profile, req.params.school_id, req.body.room_id, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});
/** @description  Remove Students for Guardian */
router.delete('/:student_profile_id/guardians/:guardian_profile_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.student_profile_id === undefined) missingParameters.push("student");
		if (req.params.guardian_profile_id === undefined) missingParameters.push("guardian");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			return studentsBO.removeFromGuardian(req.params.student_profile_id, req.params.guardian_profile_id, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}

	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

module.exports = router;
