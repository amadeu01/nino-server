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
router.param('class_id', numberValidate);

/* Get all classes for a school */
router.get('/schools/:school_id', function(req, res, next) {
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Create a class for a school */
router.post('/schools/:school_id', function(req, res, next) {
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
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