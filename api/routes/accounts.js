/** @module routes/accounts */

var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error.js');
var response = require('../mechanisms/response.js');
var useragent = require('express-useragent');
var accountsBO = require('../business/accounts.js');

var app = express();
app.use(useragent.express());

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};


//Always check all path parameters for NaN error

//router.param('school_id', numberValidate);

/**
 * @param	name {string}
 * @param	surname {string}
 * @param	email {string}
 * @param	birthDate {datetime}
 * @param	gender {Gender}
 * @param	school {School}
 * @param	token {string}
 * @param	cellphone {string}
 * @description Create a new Profile and links it to a new Account
 *
 * 						Responses:
 * 						200: profileID				- Success
 * 						400: wrong parameter 	- Parameter missing or invalid
 * 						500 									- Internal error
 * 						401 									- Cannot do that for that school
 * 						404 									- When there is no such school
 */
router.post('/', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.body.email === undefined) missingParameters.push("email");
		//else if (req.body.cellphone === undefined); //-- not needed now, we dont use it yet
		if (req.body.name === undefined) missingParameters.push("name");
		if (req.body.surname === undefined) missingParameters.push("surname");
		//if (req.body.birthdate === undefined) missingParameters.push("birthdate");  //TODO: No need to check for birthdate, optional
		if (req.useragent.isBot === true ) reject(new response(400, "Bot", 1));

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		//Provided that all the needed parameters are there, we call business to validate them
		var account = {
			email: req.body.email,
			cellphone: req.body.cellphone
		};

		var profile = {
			name: req.body.name,
			surname: req.body.surname,
			birthdate: req.body.birthdate,
			gender: req.body.gender
		};
		return accountsBO.createNewUser(account, profile)
		.then(function(res) {
			res.status(res.code).json(res.json);
			resolve(res);
		}).catch(function(err) {
			reject(err);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/**
* @description confirmAccount
*/
router.post('/authentication/:hash', function(req, res, next) {
	return new Promise(function(resolve, reject){
		if (req.useragent.isBot === true ) reject(new response(400, "Bot", 1));
		else if (req.body.password === undefined) reject(errors.missingParameters("password"));
		var device = req.useragent.platform + " " + req.useragent.os;
		var hashConfirmation = req.params.hash;
		var password = req.body.password;

		return accountsBO.confirmAccount(hashConfirmation, device, password)
		.then(function(res){
			res.status(res.code).json(res.json);
			resolve(res);
		}).catch(function(err) {
			res.status(err.code).json(err.json);
			reject(err);
		});
	});
});

/**
* @description checkIfValidated
* @return if it is authenticated already
*/
router.get('/authentication/:hash', function(req, res, next) {
	return new Promise(function(resolve, reject){
		if (req.useragent.isBot === true ) reject(new response(400, "Bot", 1));
		var origin = req.useragent.Platform + " " + req.useragent.OS;
		var hashConfirmation = req.params.hash;

		return accountsBO.findWithHash(hashConfirmation)
		.then(function(res){
			res.status(res.code).json(res.json);
			resolve(res);
		}).catch(function(err) {
			res.status(err.code).json(err.json);
			reject(err);
		});
	});
});

/**
* @description logIn. <tt>email</tt> is used to identify the user.
*/
router.post('/authentication', function(req, res) {
	return new Promise(function (resolve, reject) {
		if (req.body.user === undefined) reject(errors.missingParameters('email'));
		else if (req.body.password === undefined) reject(errors.missingParameters('password'));
		var device = req.useragent.Platform + " " + req.useragent.OS;
		var email = req.body.user;
		var password = req.body.password;
		var populate = req.query.populate;

		return accountsBO.logIn(email, password, device, populate)
		.then(function(res) {
			res.status(res.code).json(res.json);
			resolve(res);
		}).catch(function(err){
			res.status(err.code).json(err.json);
			reject(err);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
		reject(err);
	});
});

/**
* @description logout
*/
router.delete('/authentication', function(req, res){
	return new Promise (function (resolve, reject){
		//TODO: receber device como parametro para poder deslogar a distancia! e o email nao ta sendo usado pra nada, nao tem pq ta aqui :)
		if (req.body.user === undefined) reject(errors.missingParameters('email'));
		else if (req.rawToken === undefined) reject(errors.missingParameters('rawToken'));
		var device = req.useragent.Platform + " " + req.useragent.OS;

		return accountsBO.logout(device, req.rawToken, req.token)
		.then(function(res){
			es.status(res.code).json(res.json);
			resolve(res);
		}).catch(function(err){
			res.status(err.code).json(err.json);
			reject(err);
		});
	});
});

module.exports = router;
