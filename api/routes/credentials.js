var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var app = require('../app');
var crypto = require('crypto');
var errors = require('../services/errors');
var validator = require('validator');
var services = require('../services');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};

//Always check all path parameters for NaN error
router.param('credential_id', numberValidate);

/* Create a Caretaker credential : LogIn. */
router.post('/educators', function(req, res, next) {
	//TODO: console.log(req.useragent);//Register new device or check existing
	//Check parameters
	if (req.body.password === undefined) res.status(400).json(errors.invalidParameters("password").clean);
	else if (req.body.email === undefined || !validator.isEmail(req.body.email)) res.status(400).json(errors.invalidParameters("email").clean);
	else {
		//Done checking, should call business
		services.credentials.loginEducator(req.body.email, req.body.password, req.useragent.browser + ' ' + req.useragent.os)
		.then(function(token) {
			res.json({token: token});
		})
		.catch(function(error) {
			res.status(error.httpCode).json(error.clean);
		});
	}
});

/* Create a Guardian credential : LogIn. */
router.post('/guardians', function(req, res, next) {
	//Check parameters
	if (req.body.password === undefined) res.status(400).json(errors.invalidParameters("password").clean);
	else if (req.body.email === undefined || !validator.isEmail(req.body.email)) res.status(400).json(errors.invalidParameters("email").clean);
	else {
	//Done checking, should call business
		
	//Done, send response
		res.send('WIP');
	}
});

/*LogOut*/
router.delete('/:credential_id', function(req, res, next) {
	//Check parameters
	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token").clean);
	else {
		//Should now call business
	
		//End response
		res.send('WIP');
	}
});

module.exports = router;