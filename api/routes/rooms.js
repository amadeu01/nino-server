var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
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
router.param('room_id', numberValidate);
router.param('educator_id', numberValidate);
router.param('student_id', numberValidate);
router.param('class_id', numberValidate);

/* Create a new room for a school */
router.post('/schools/:school_id/classes/:class_id', function(req, res, next) {
	//Check required parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.classroom_name === undefined) res.status(400).json(errors.invalidParameters("classroom_name"));
	else {
		//Call business
		
		//End response
  	res.send('WIP');
	}
});

/* Update room information */
router.put('/:room_id', function(req, res, next) {
	//Check required parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.classroom_name === undefined) res.status(400).json(errors.invalidParameters("classroom_name"));
	else {
		//Call business
		
		//End response
  	res.send('WIP');
	}
});

/* Marks a room for deletion */
router.delete('/:room_id', function(req, res, next) {
	//Only parameter is school_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Add an educator to a room */
router.post('/:room_id/educators/:educator_id', function(req, res, next) {
	//Only parameter are school_id and educator_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Remove an educator from a room */
router.delete('/:room_id/educators/:educator_id', function(req, res, next) {
	//Only parameter are school_id and educator_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Add a student to a room */
router.post('/:room_id/students/:student_id', function(req, res, next) {
	//Only parameter are school_id and student_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Remove a student from a room */
router.delete('/:room_id/students/:student_id', function(req, res, next) {
	//Only parameter are school_id and student_id, already checked
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Get all rooms for an educator */
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