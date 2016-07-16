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

/**@description Add educator to school */
router.post('/schools/:school_id', function(req, res, next){
	return new Promise(function(resolve, reject){
		if (req.token === undefined) reject(errors.missingParameters('token'));
		else if (req.rawToken === undefined) reject(errors.missingParameters('rawToken'));
		else if (req.params.school_id === undefined) reject(errors.missingParameters('school_id'));
		else if (req.body.profile_id === undefined) reject(errors.missingParameters('profile_id'));
		else {
			return employeesBO.addEducatorToSchool(req.params.school_id, req.body.profile_id, req.rawToken, req.token)
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

/**@description get educators for school */
router.get('/schools/:school_id/*', function(req, res, next){
	return new Promise(function(resolve, reject){
		if (req.token === undefined) reject(errors.missingParameters('token'));
		else if (req.rawToken === undefined) reject(errors.missingParameters('rawToken'));
		else if (req.params.school_id === undefined) reject(errors.missingParameters('school_id'));
		else {
			if (req.query.room === undefined) {
				return employeesBO.getEducatorForSchool(school, req.rawToken, req.token)
				.then(function(response){
					res.status(response.code).json(response.json);
					resolve(classes);
				}).catch(function(err){
					res.status(err.code).json(err.json);
					reject(err);
				});
			} else {
				return employeesBO.getEducatorForRoom(school, rawToken, token)
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

/**@description get educators for Room
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
			return employeesBO.removeEducatorFromSchool(req.params.school_id, req.body.profile_id, req.rawToken, req.token)
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
