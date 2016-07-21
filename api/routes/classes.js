/** router/classes */

var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var validator = require('validator');
var classesBO = require('../business/classes.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};

// //Always check all path parameters for NaN error
// router.param('school_id', numberValidate);
// router.param('class_id', numberValidate);

/**
 * @description Get all classes for a given school
 * @param School
 * @param Token
 * @return Classes {Array<Class>}
*/
router.get('/schools/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.school_id === undefined) missingParameters.push("school_id");
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			return classesBO.getClassesForSchool(req.params.school_id, req.device, req.rawToken, req.token)
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

/**
* @description Create a class for a school
* @param class {string}
* @param School
* @return ClassID
*/
router.post('/schools/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.body.class_name === undefined) missingParameters.push('Class_name');
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			return classesBO.createClassForSchool(req.body.class_name, req.params.school_id, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(response);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});

/** @description Update a class information */
router.put('/:class_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.body.school_id === undefined) missingParameters.push('school_id');
		if (req.params.class_id === undefined) missingParameters.push('class_id');
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			var classInfo = {
				class_id: req.params.class_id,
				class_name: req.body.name,
				menu: req.body.menu
			};
			return classesBO.update(req.body.school_id, classInfo, req.device, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
			}).catch(function(err){
				res.status(err.code).json(code.json);
			});
		}
	});
});

/** @description Mark a Class for deleting */
router.delete('/:class_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameter.push('token');
		if (req.rawToken === undefined) missingParameter.push('rawToken');
		if (req.body.school_id === undefined) missingParameters.push('school_id');
		if (req.params.class_id === undefined) missingParameters.push('class_id');
		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		else {
			return classesBO.delete(req.body.school_id, req.params.class_id, req.device, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
			}).catch(function(err){
				res.status(err.code).json(code.json);
			});
		}
	});
});



module.exports = router;
