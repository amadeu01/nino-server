var express = require('express');
var router = express.Router();
var app = require('../app');
var errors = require('../mechanisms/error');
var validator = require('validator');
var employeesBO = require('../business/employees.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};

/**@description Add educator to school
 @deprecated*/
router.post('/schools/:school_id', function(req, res, next){
	return new Promise(function(resolve, reject){
		missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.params.school_id === undefined) missingParameters.push('school_id');
		if (req.body.profile_id === undefined) missingParameters.push('profile_id');
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			return employeesBO.addEducatorToSchool(req.params.school_id, req.body.profile_id, req.device, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
				resolve(classes);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});

router.get('/me', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.device === undefined) missingParameters.push('device');
		
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		
		else {
			return employeesBO.getEmployeeWithProfile(token.profile, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
				resolve(classes);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
})

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

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
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
			.then(function(response){
				res.status(response.code).json(response.json);
				resolve(classes);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});

/** @description update employee info */
router.put('/educators/schools/:school_id', function(req, res, next){
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.device === undefined) missingParameters.push('device');
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
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
			return employeesBO.updateEmployeeFromSchool(req.params.school_id, account, profile, req.device, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
				resolve(classes);
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
		if (req.token === undefined) reject(errors.missingParameters('token'));
		else if (req.rawToken === undefined) reject(errors.missingParameters('rawToken'));
		else if (req.params.school_id === undefined) reject(errors.missingParameters('school_id'));
		else {
			if (req.query.room === undefined) {
				return employeesBO.getEducatorForSchool(req.params.school_id, req.rawToken, req.token)
				.then(function(response){
					res.status(response.code).json(response.json);
					resolve(classes);
				}).catch(function(err){
					res.status(err.code).json(err.json);
					reject(err);
				});
			} else {
				return employeesBO.getEducatorForRoom(school_id, req.rawToken, req.token)
				.then(function(response){
					res.status(response.code).json(response.json);
					resolve(classes);
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
router.delete('/schools/:school_id', function(req, res, next){
	return new Promise(function(resolve, reject){
		if (req.token === undefined) reject(errors.missingParameters('token'));
		else if (req.body.profile_id === undefined) reject(errors.missingParameters('profile_id'));
		else if (req.rawToken === undefined) reject(errors.missingParameters('rawToken'));
		else if (req.params.school_id === undefined) reject(errors.missingParameters('school_id'));
		else {
			return employeesBO.removeEmployeeFromSchool(req.params.school_id, req.body.profile_id, req.device, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
				resolve(classes);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});

module.exports = router;
