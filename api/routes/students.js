var express = require('express');
var router = express.Router();
var errors = require('../services/errors');
var validator = require('validator');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};

//Always check all path parameters for NaN error
router.param('guardian_id', numberValidate);
router.param('student_id', numberValidate);
router.param('classroom_id', numberValidate);

/* Send push notification to all student's guardians */
router.put('/:student_id/notifications', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.data === undefined) res.status(400).json(errors.invalidParameters("data"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Get Student info */
router.get('/:student_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Deletes Student */
router.delete('/:student_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Updates Student */
router.put('/:student_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.name === undefined) {
		if (req.body.surname === undefined) {
			if (req.body.birthdate === undefined) {
				if (req.body.school === undefined) {
					if (req.body.gender === undefined || !validator.isNumeric(req.body.gender)) {
						//Empty update req
						res.status(400).json(errors.invalidParameters("empty"));
					}
				}
			}
		}
	}
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Updates Student's profile picture */
router.put('/:student_id/profilePic', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.image === undefined) res.status(400).json(errors.invalidParameters("image"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Reads Student's profile picture */
router.get('/:student_id/profilePic', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Create a new Student for that school */
router.post('/schools/:school_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.name === undefined) res.status(400).json(errors.invalidParameters("name"));
	else if (req.body.surname === undefined) res.status(400).json(errors.invalidParameters("surname"));
	else if (req.body.birthdate === undefined || !validator.isNumeric(req.body.birthdate)) res.status(400).json(errors.invalidParameters("birthdate"));
	else if (req.body.gender === undefined) res.status(400).json(errors.invalidParameters("gender"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Get students listing for a Guardian. */
router.get('/guardians/:guardian_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Get list of students for a classroom */
router.get('/classrooms/:classroom_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

module.exports = router;
