/** @module routes */

var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');

/**
* @class
*/
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
 *						Name *
 *						Surname *
 *						Email *
 *						BirthDate
 *						Gender
 *						School
 *						Token
 *						Cellphone
 * Responses:
 * 						200: profileID				- Success
 * 						400: wrong parameter 	- Parameter missing or invalid
 * 						500 									- Internal error
 * 						401 									- Cannot do that for that school
 * 						404 									- When there is no such school
 */
router.post('/', function(req, res, next) {

	//Check if needed params exists
	return new Promise(function(resolve, reject) {
		if (req.body.email === undefined) reject(errors.missingParameter('email'));
		// else if (req.body.cellphone === undefined); //-- not needed now, we dont use it yet
		else if (req.body.name === undefined) reject(errors.missingParameter('name'));
		else if (req.body.surname === undefined) reject(errors.missingParameter('surname'));

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

		return accountsBO.createNewUser(account, profile);

	})
	.then(function(response) {
		res.status(response.status).json(response.json);
	}).catch(function(error) {
		res.status(error.status).json(error.json);
	});
});

router.post('/authentication', function(req, res, next) {

});

module.exports = router;
