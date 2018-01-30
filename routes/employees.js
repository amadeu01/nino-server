var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var employeesBO = require('../business/employees.js');
var profilesBO = require('../business/profiles.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(responses.invalidParameters("path_isNaN"));
	}
};

/** @description Create educator to school */
router.post('/educators/schools/:school_id', function(req, res, next){
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.device === undefined) missingParameters.push('device');
		if (req.body.email === undefined) missingParameters.push("email");
		//else if (req.body.cellphone === undefined); //-- not needed now, we dont use it yet
		if (req.body.name === undefined) missingParameters.push("name");
		if (req.body.surname === undefined) missingParameters.push("surname");

		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
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
			employeesBO.createEducator(req.params.school_id, account, profile, req.device, req.rawToken, req.token)
			.then(function(resp){
				resolve(resp);
			}).catch(function(err){
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

/** @description get educators for school */
router.get('/educators/schools/:school_id', function(req, res, next){
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.device === undefined) missingParameters.push('device');
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			if (req.query.room_id === undefined) {
				employeesBO.getEducatorForSchool(req.params.school_id, req.device, req.rawToken, req.token)
				.then(function(resp){
					resolve(resp);
				}).catch(function(err){
					reject(err);
				});
			} else {
				if (req.query.class_id === undefined) resolve(responses.missingParameters('class_id'));
				employeesBO.getEducatorForRoom(req.params.school_id, req.query.class_id, req.query.room_id, req.device, req.rawToken, req.token)
				.then(function(resp){
					resolve(resp);
				}).catch(function(err){
					reject(err);
				});
			}
		}
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/** @description remove employee from school
* @param:
* School
* Class
* Room
* Token
@return:
* [Profile]
*
*/
router.delete('/:profile_id/schools/:school_id', function(req, res, next){
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.device === undefined) missingParameters.push('device');
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			employeesBO.removeEmployeeFromSchool(req.params.school_id, req.body.profile_id, req.device, req.rawToken, req.token)
			.then(function(resp){
				resolve(resp);
			}).catch(function(err){
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
