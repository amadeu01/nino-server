/** router/classes */

var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var classesBO = require('../business/classes.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(responses.invalidParameters("path_isNaN"));
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
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			classesBO.getClassesForSchool(req.params.school_id, req.device, req.rawToken, req.token)
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


router.get('/:class_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			classesBO.getClass(req.params.class_id, req.device, req.rawToken, req.token)
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
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			classesBO.createClassForSchool(req.body.class_name, req.params.school_id, req.device, req.rawToken, req.token)
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

/** @description Update a class information */
router.put('/:class_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push('token');
		if (req.rawToken === undefined) missingParameters.push('rawToken');
		if (req.body.school_id === undefined) missingParameters.push('school_id');
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			var classInfo = {
				class_id: req.params.class_id,
				class_name: req.body.name,
				menu: req.body.menu
			};
			return classesBO.update(req.body.school_id, classInfo, req.device, req.rawToken, req.token)
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

/** @description Mark a Class for deleting */
router.delete('/:class_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameter.push('token');
		if (req.rawToken === undefined) missingParameter.push('rawToken');
		if (req.body.school_id === undefined) missingParameters.push('school_id');
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			classesBO.delete(req.body.school_id, req.params.class_id, req.device, req.rawToken, req.token)
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
