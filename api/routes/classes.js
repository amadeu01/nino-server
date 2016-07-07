var express = require('express');
var router = express.Router();
var useragent = require('express-useragent');
var errors = require('../mechanisms/error');
var validator = require('validator');
var classesBO = require('../business/classes.js')

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
 * @description Get all classes for a school
*/
router.get('/schools/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		if (req.token === undefined) reject(errors.missingParameter('token'));
		else if (req.body.school === undefined) reject(errors.missingParameter('School'));
		else {
			return classesBO.getClassesForSchool(school, token)
			.then(function(classes){
				res.status(200);
				res.send(classes);
				resolve(classes);
			}).catch(function(err){
				res.status(err.code);
				res.send(err);
				reject(err);
			});
		}
	});
});

/**
* @description Create a class for a school
*/
router.post('/school/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		if (req.token === undefined) reject(errors.missingParameter('Token'));
		else if(req.body.class_name === undefined) reject (errors.missingParameter('Class_name'));
		else {
			var device = req.useragent.Platform + " " + req.useragent.OS;
			return classesBO.createClassForSchool(class_name, school, device, token)
			.then(function(class_id){
				res.status(200);
				res.send(class_id);
				resolve(class_id);
			}).catch(function(err){
				res.status(err.code);
				res.send(err);
				reject(err);
			});
		}
	});
});

/* Update a class information */
router.put('/:class_id', function(req, res, next) {
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business

		//End response
		res.send('WIP');
	}
});

/* Mark a Class for deletion */
router.delete('/:class_id', function(req, res, next) {
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business

		//End response
		res.send('WIP');
	}
});



module.exports = router;
