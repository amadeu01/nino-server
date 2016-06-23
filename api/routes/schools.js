var express = require('express');
var router = express.Router();
var app = require('../app');
var errors = require('../services/errors');
var validator = require('validator');
var services = require('../services');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).json(errors.invalidParameters("path_isNaN").clean);
	}
};

//Always check all path parameters for NaN error
router.param('school_id', numberValidate);

/* Get School's info. */
router.get('/:school_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token").clean);
	else {
		//Should now call business

		//End response
		res.send('WIP');
	}
});

/* Update a School */
router.put('/:school_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token").clean);
	else if (req.body.name === undefined) {
		if (req.body.addr === undefined) {
			if (req.body.cnpj === undefined || !validator.isNumeric(req.body.cnpj)) {
				if (req.body.telephone === undefined || !validator.isNumeric(req.body.telephone)) {
					if (req.body.email === undefined || !validator.isEmail(req.body.email)) {
						if (req.body.owner === undefined || !validator.isNumeric(req.body.owner)){
							//Every parameter for the update is null, req is empty
							res.status(400).json(errors.invalidParameters("empty").clean);
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
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token").clean);
	else {
		//Should now call business

		//End response
		res.send('WIP');
	}
});

/* Send push notification to all school guardians */
router.post('/:school_id/notifications/guardians', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token").clean);
	else if (req.body.data === undefined) res.status(400).json(errors.invalidParameters("data").clean);
	else {
		//Should now call business

		//End response
		res.send('WIP');
	}
});

/* Send push notification to all school educators */
router.post('/:school_id/notifications/educators', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token").clean);
	else if (req.body.data === undefined) res.status(400).json(errors.invalidParameters("data").clean);
	else {
		//Should now call business

		//End response
		res.send('WIP');
	}
});

/* Create new school */
router.post('/', function(req, res, next) {
	//Check parameters
	if (req.body.school === undefined) res.status(400).json(errors.invalidParameters("school").clean);
	else if (req.body.school.name === undefined) res.status(400).json(errors.invalidParameters("school.name").clean);
	else if (req.body.school.email === undefined || !validator.isEmail(req.body.school.email)) res.status(400).json(errors.invalidParameters("school.email").clean);
	else if (req.body.owner === undefined) res.status(400).json(errors.invalidParameters("owner").clean);
	else if (req.body.owner.name === undefined) res.status(400).json(errors.invalidParameters=== undefined("owner.name").clean);
	else if (req.body.owner.surname === undefined) res.status(400).json(errors.invalidParameters("owner.surname").clean);
	else if (req.body.owner.password === undefined) res.status(400).json(errors.invalidParameters("owner.password").clean);
	else if (req.body.owner.email === undefined || !validator.isEmail(req.body.owner.email)) res.status(400).json(errors.invalidParameters("owner.email").clean);
	else if (req.body.owner.cel === undefined || !validator.isNumeric(req.body.owner.cel)) res.status(400).json(errors.invalidParameters("owner.cel").clean);
	else {
		//Should now call business
		parameters = {
			owner: {
				name: req.body.owner.name,
				surname: req.body.owner.surname,
				password: req.body.owner.password,
				email: req.body.owner.email,
				cel: req.body.owner.cel
			},
			school: {
				name: req.body.school.name,
				email: req.body.school.email
			},
		};
		if (req.body.school.telephone !== undefined && validator.isNumeric(req.body.school.telephone)) {
			parameters.school.telephone = req.body.school.telephone;
		}
		if (req.body.school.addr !== undefined) {
			parameters.school.addr = req.body.school.addr;
		}
		if (req.body.school.cnpj !== undefined && validator.isNumeric(req.body.school.cnpj)) {
			parameters.school.cnpj = req.body.school.cnpj;
		}


		services.schools.create(parameters)
		.then(function(success) {
			res.json(success);
		})
		.catch(function(error) {
			res.status(error.httpCode).json(error.clean);
		});
		//End response
	}
});

/* Updates school logotype */
router.put('/:school_id/logotype', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token").clean);
	else if (req.body.image === undefined) res.status(400).json(errors.invalidParameters("image").clean);
	else {
		//Should now call business

		//End response
		res.send('WIP');
	}
});

/* Reads school logotype */
router.get('/:school_id/logotype', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token").clean);
	else {
		//Should now call business

		//End response
		res.send('WIP');
	}
});

module.exports = router;
