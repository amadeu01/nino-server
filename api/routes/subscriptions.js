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
router.param('subscription_id', validator);

/* Greate new Subscription. */
router.post('/', function(req, res, next) {
	//Check parameters
	if (req.body.email === undefined) res.status(400).json(errors.invalidParameters("email"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Remove subscription */
router.delete('/:email', function(req, res, next) {
	//Check parameters
	if (req.query.hash === undefined) res.status(400).json(errors.invalidParameters("hash"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

module.exports = router;