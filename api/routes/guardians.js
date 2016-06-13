var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var validator = require('validator');

/*Check if parameter is valid id*/
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

/* Get list of Student's Guardians. */
router.get('/students/:student_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/*Get Guardian info*/
router.get('/:guardian_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/*Delete a Guardian*/
router.delete('/:guardian_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/*Add a Guardian to a Student */
router.post('/:guardian_id/students/:student_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/*Delete the 'Guardianship' between a Guardian and a Baby*/
router.delete('/:guardian_id/students/:student_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/*Create a new Guardian*/
router.post('/', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.user.name === undefined) res.status(400).json(errors.invalidParameters("user.name"));
	else if (req.body.user.surname === undefined) res.status(400).json(errors.invalidParameters("user.surname"));
	else if (req.body.user.password === undefined) res.status(400).json(errors.invalidParameters("user.password"));
	else if (req.body.user.email === undefined || !validator.isEmail(req.body.user.email)) res.status(400).json(errors.invalidParameters("user.email"));
	else if (req.body.user.cel === undefined || !validator.isNumeric(req.body.user.cel)) res.status(400).json(errors.invalidParameters("user.cel"));
	else if (req.body.privileges === undefined || !validator.isNumeric(req.body.privileges)) res.status(400).json(errors.invalidParameters("privileges"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

module.exports = router;
