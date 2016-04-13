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
	if (req.body.user.name === undefined) res.status(400).json(errors.invalidParameters("user.name"));
	else {
		//Business
	
		//Send res
	  res.send('WIP');
	}
});

/* Create new Caretaker for that school */
router.post('/schools/:school_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.user.name === undefined) res.status(400).json(errors.invalidParameters("user.name"));
	else if (req.body.user.surname === undefined) res.status(400).json(errors.invalidParameters("user.surname"));
	else if (req.body.user.password === undefined) res.status(400).json(errors.invalidParameters("user.password"));
	else if (req.body.user.email === undefined) res.status(400).json(errors.invalidParameters("user.email"));
	else if (req.body.user.cel === undefined) res.status(400).json(errors.invalidParameters("user.cel"));
	else if (req.body.privileges === undefined) res.status(400).json(errors.invalidParameters("privileges"));
	else {
		//Business
	
		//Send res
	  res.send('WIP');
	}
});


router.get('/classrooms/:classroom_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Delete a caretaker */
router.delete('/:educator_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Update a caretaker */
router.put('/:educator_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.school === undefined) 
	{
		if (req.body.permissions === undefined) {
			//Update req is empty
			res.status(400).json(errors.invalidParameters("Empty"));
		}
	}
	else {
		//Business
	
		//Send res
	  res.send('WIP');
	}
});

module.exports = router;
