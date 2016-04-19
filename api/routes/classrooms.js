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
router.param('school_id', numberValidate);
router.param('classroom_id', numberValidate);
router.param('educator_id', numberValidate);
router.param('student_id', numberValidate);

/* Get all classrooms for a school */
router.get('/schools/:school_id', function(req, res, next) {
	//Only parameter is school_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Create a new classroom for a school */
router.post('/schools/:school_id', function(req, res, next) {
	//Check required parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.classroom_name === undefined) res.status(400).json(errors.invalidParameters("classroom_name"));
	else {
		//Call business
		
		//End response
  	res.send('WIP');
	}
});

/* Update classroom information */
router.put('/:classroom_id', function(req, res, next) {
	//Check required parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.classroom_name === undefined) res.status(400).json(errors.invalidParameters("classroom_name"));
	else {
		//Call business
		
		//End response
  	res.send('WIP');
	}
});

/* Marks a classroom for deletion */
router.delete('/:classroom_id', function(req, res, next) {
	//Only parameter is school_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Add an educator to a classroom */
router.post('/:classroom_id/educators/:educator_id', function(req, res, next) {
	//Only parameter are school_id and educator_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Remove an educator from a classroom */
router.delete('/:classroom_id/educators/:educator_id', function(req, res, next) {
	//Only parameter are school_id and educator_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Add a student to a classroom */
router.post('/:classroom_id/students/:student_id', function(req, res, next) {
	//Only parameter are school_id and student_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Remove a student from a classroom */
router.delete('/:classroom_id/students/:student_id', function(req, res, next) {
	//Only parameter are school_id and student_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Get all classrooms for an educator */
router.get('/educators/:educator_id', function(req, res, next) {
	//Only parameter is educator_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

module.exports = router;