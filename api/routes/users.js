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
router.param('user_id', validator);

/* Update user's profile picture */
router.put('/:user_id/profilePic', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.image === undefined) res.status(400).json(errors.invalidParameters("image"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Reads user's profile picture */
router.get('/:user_id/profilePic', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Confirms user's register information */
router.post('/confirmation/:confirmation_hash', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Post a notification to all devices of the user */
router.post('/:user_id/notifications', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.date === undefined) res.status(400).json(errors.invalidParameters("data"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});


module.exports = router;