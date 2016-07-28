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

/**@description Add employee to school
 @deprecated*/
router.post('/:profile_id/schools/:school_id', function(req, res, next){
	return new Promise(function(resolve, reject){
		missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.params.school_id === undefined) missingParameters.push('school_id');
		if (req.params.profile_id === undefined) missingParameters.push('profile_id');
		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
			return employeesBO.addEmployeeToSchool(req.params.school_id, req.params.profile_id, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(classes);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});
/**@description */
router.get('/me', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];

		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.device === undefined) missingParameters.push('device');
		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
			return profilesBO.getMyProfile(req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	}).catch(function(err) {
		res.status(500).json(err);
	});
});

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

		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
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
			return employeesBO.createEducator(req.params.school_id, account, profile, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});

/** @description update employee info */
router.put('/:profile_id/schools/:school_id', function(req, res, next){
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.device === undefined) missingParameters.push('device');
		if (req.params.profile_id === undefined) missingParameters.push('profile_id');
		if (req.params.school_id === undefined) missingParameters.push('school_id');
		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
			var account = {
				email: req.body.email,
				cellphone: req.body.cellphone
			};

			var profile = {
				id: req.params.profile_id,
				name: req.body.name,
				surname: req.body.surname,
				birthdate: req.body.birthdate,
				gender: req.body.gender
			};
			return employeesBO.updateEmployeeFromSchool(req.params.school_id, account, profile, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});

/** @description get educators for school */
router.get('/educators/schools/:school_id/*', function(req, res, next){
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.device === undefined) missingParameters.push('device');
		if (req.params.school_id === undefined) missingParameters.push('school_id');
		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
			if (req.query.room_id === undefined) {
				return employeesBO.getEducatorForSchool(req.params.school_id, req.device, req.rawToken, req.token)
				.then(function(resp){
					res.status(resp.code).json(resp.json);
					resolve(resp);
				}).catch(function(err){
					res.status(err.code).json(err.json);
					reject(err);
				});
			} else {
				if (req.query.class_id === undefined) reject(responses.missingParameters('class_id'));
				return employeesBO.getEducatorForRoom(req.params.school_id, req.query.class_id, req.query.room_id, req.device, req.rawToken, req.token)
				.then(function(resp){
					res.status(resp.code).json(resp.json);
					resolve(resp);
				}).catch(function(err){
					res.status(err.code).json(err.json);
					reject(err);
				});
			}
		}
	});
});

/** @description delete employee from school
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
		if (req.token === undefined) reject(responses.missingParameters('token'));
		else if (req.body.profile_id === undefined) reject(responses.missingParameters('profile_id'));
		else if (req.rawToken === undefined) reject(responses.missingParameters('rawToken'));
		else if (req.params.school_id === undefined) reject(responses.missingParameters('school_id'));
		else {
			return employeesBO.removeEmployeeFromSchool(req.params.school_id, req.body.profile_id, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});

module.exports = router;
