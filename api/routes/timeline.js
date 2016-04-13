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
router.param('student_id', validator);
router.param('guardian_id', validator);
router.param('post_id', validator);

/* Get Timeline cells for that Baby. */
router.get('/students/:student_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Create new Post for a Baby */
router.post('/students/:student_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Create new Post for a list of Baby */
router.post('/students', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Get Timeline cells for that Guardian */
router.get('/guardians/:guardian_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Delete Post */
router.delete('/:post_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Update Post */
router.put('/:post_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) req.status(400).end(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

module.exports = router;