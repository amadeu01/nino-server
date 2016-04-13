var express = require('express');
var router = express.Router();
var app = require('../app');
var errors = require('../business/errors');

var validator = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).json(errors.invalidParameters("path_isNaN"));
	}
};

//Always check all path parameters for NaN error
router.param('school_id', validator);

/* Get School's info. */
router.get('/:school_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Update a School */
router.put('/:school_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.name === undefined) {
		if (req.body.addr === undefined) {
			if (req.body.cnpj === undefined) {
				if (req.body.telephone === undefined) {
					if (req.body.email === undefined) {
						if (req.body.owner === undefined){
							//Every parameter for the update is null, req is empty
							res.status(400).json(errors.invalidParameters("empty"));
						}
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

/* Delete a School */
router.delete('/:school_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Send push notification to all school guardians */
router.post('/:school_id/notifications/guardians', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.date === undefined) res.status(400).json(errors.invalidParameters("data"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Send push notification to all school educators */
router.post('/:school_id/notifications/educators', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.date === undefined) res.status(400).json(errors.invalidParameters("data"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Create new school */
router.post('/', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.school.name === undefined) res.status(400).json(errors.invalidParameters("school.name"));
	else if (req.body.school.email === undefined) res.status(400).json(errors.invalidParameters("school.email"));
	else if (req.body.owner.name === undefined) res.status(400).json(errors.invalidParameters=== undefined("owner.name"));
	else if (req.body.owner.surname === undefined) res.status(400).json(errors.invalidParameters("owner.surname"));
	else if (req.body.owner.password === undefined) res.status(400).json(errors.invalidParameters("owner.password"));
	else if (req.body.owner.email === undefined) res.status(400).json(errors.invalidParameters("owner.email"));
	else if (req.body.owner.cel === undefined) res.status(400).json(errors.invalidParameters("owner.cel"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

/* Updates school logotype */
router.put('/:school_id/logotype', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else if (req.body.image === undefined) res.status(400).json(errors.invalidParameters("image"));
	else {
		//Should now call business

		//End response
		res.send('WIP');
	}
});

/* Reads school logotype */
router.get('/:school_id/logotype', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

module.exports = router;