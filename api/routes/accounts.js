/*
*
* Last to modify: Amadeu Cavalcante
*/
var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var validator = require('validator');
var accountsBO = require('../business/accounts.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};

//Always check all path parameters for NaN error

//router.param('school_id', numberValidate);

/* Create a new Profile and links it to a new Account
 * Parameters:
 *						XXX
 *						XXX
 *						XXX
 *						XXX
 * Responses:
 * 						CODE: data
 * 						CODE: data
 * 						CODE: data
 * 						CODE: data
 */
router.post('/', function(req, res, next) {
	//Check if needed params exists
	if (req.body.email === undefined);
	// else if (req.body.cellphone === undefined); //-- not needed now, we dont use it yet
	else if (req.body.password === undefined);
	else if (req.body.name === undefined);
	else if (req.body.surname === undefined);
	else if (req.body.birthdate === undefined);
	else if (req.body.gender === undefined);

	//Provided that all the needed parameters are there, we call business to validate them

	var account = {
		email: req.body.email,
		cellphone: req.body.cellphone,
		password: req.body.password
	};

	var profile = {
		name: req.body.name,
		surname: req.body.surname,
		birthdate: req.body.birthdate,
		gender: req.body.gender
	};

	accountsBO.createNewUser(account, profile)
	.then(function(response) {
		res.status(response.status).json(response.json);
	}).catch(function(error) {
		res.status(error.status).json(error.json);
	});
});

module.exports = router;
