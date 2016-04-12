var express = require('express');
var router = express.Router();
var errors = require('../business/errors');

var validator = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};

//Always check all path parameters for NaN error
router.param('guardian_id', validator);
router.param('student_id', validator);
router.param('classroom_id', validator);

/* Send push notification to all student's guardians */
router.put('/:student_id/notifications', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else if (req.body.data ==  null) req.status(400).end(errors.invalidParameters("data"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Get Student info */
router.get('/:student_id', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Deletes Student */
router.delete('/:student_id', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Updates Student */
router.put('/:student_id', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else if (req.body.name == null) {
		if (req.body.surname == null) {
			if (req.body.birthdate == null) {
				if (req.body.school == null) {
					if (req.body.gender == null) {
						//Empty update req
						req.status(400).end(errors.invalidParameters("empty"));
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
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Reads Student's profile picture */
router.get('/:student_id/profilePic', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Create a new Student for that school */
router.post('/schools/:school_id', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else if (req.body.name == null) req.status(400).end(errors.invalidParameters("name"));
	else if (req.body.surname == null) req.status(400).end(errors.invalidParameters("surname"));
	else if (req.body.birthdate == null) req.status(400).end(errors.invalidParameters("birthdate"));
	else if (req.body.gender == null) req.status(400).end(errors.invalidParameters("gender"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Get students listing for a Guardian. */
router.get('/guardians/:guardian_id', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Get list of students for a classroom */
router.get('/classrooms/:classroom_id', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

module.exports = router;
