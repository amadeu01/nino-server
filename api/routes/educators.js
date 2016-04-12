var express = require('express');
var router = express.Router();
var app = require('../app');
var permissions = require('../business/permissions');
var errors = require('../business/errors');

var validator = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};

//Always check all path parameters for NaN error
router.param('school_id', validator);
router.param('educator_id', validator);
router.param('classroom_id', validator);

/* Get users listing for a school. */
router.get('/schools/:school_id', function(req, res, next) {
	//Check parameters
	if (req.body.user.name == null) req.status(400).end(errors.invalidParameters("user.name"));
	else {
		//Business
	
		//Send res
	  res.send('WIP');
	}
});

/* Create new Caretaker for that school */
router.post('/schools/:school_id', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else if (req.body.user.name == null) req.status(400).end(errors.invalidParameters("user.name"));
	else if (req.body.user.surname == null) req.status(400).end(errors.invalidParameters("user.surname"));
	else if (req.body.user.password == null) req.status(400).end(errors.invalidParameters("user.password"));
	else if (req.body.user.email == null) req.status(400).end(errors.invalidParameters("user.email"));
	else if (req.body.user.cel == null) req.status(400).end(errors.invalidParameters("user.cel"));
	else if (req.body.privileges == null) req.status(400).end(errors.invalidParameters("privileges"));
	else {
		//Business
	
		//Send res
	  res.send('WIP');
	}
});


router.get('/classrooms/:classroom_id', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Delete a caretaker */
router.delete('/:educator_id', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Update a caretaker */
router.put('/:educator_id', function(req, res, next) {
	//Check parameters
	if (req.token == null) req.status(400).end(errors.invalidParameters("token"));
	else if (req.body.school == null) 
	{
		if (req.body.permissions == null) {
			//Update req is empty
			req.status(400).end(errors.invalidParameters("Empty"));
		}
	}
	else {
		//Business
	
		//Send res
	  res.send('WIP');
	}
});

module.exports = router;
