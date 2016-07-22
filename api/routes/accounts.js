/** @module routes/accounts */

var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var accountsBO = require('../business/accounts.js');
var app = express();

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(responses.invalidParameters("path_isNaN"));
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
 * 						200: profileID				- Executed
 * 						400: wrong parameter 	- Parameter missing or invalid
 * 						500 									- Internal error
 * 						403 									- Cannot do that for that school
 */
router.post('/', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.body.email === undefined) missingParameters.push("email");
		if (req.body.name === undefined) missingParameters.push("name");
		if (req.body.surname === undefined) missingParameters.push("surname");
		if (req.useragent.isBot === true ) reject(responses.isBot());

		else if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
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
			.then(function(resp) {
				res.status(resp.code).json(resp.json);
				resolve(resp);
			}).catch(function(err) {
				var resp = responses.internalError(err);
				res.status(resp.code).json(resp.json);
				resolve(response);
			});
		}
	}).catch(function(err){
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**
* @description confirmAccount
*/
router.post('/authentication/:hash', function(req, res, next) {
	return new Promise(function(resolve, reject){
		if (req.useragent.isBot === true ) reject(new response(400, "Bot", 1));
		else if (req.body.password === undefined) reject(responses.missingParameters("password"));
		var device = req.useragent.platform + " " + req.useragent.os;
		var hashConfirmation = req.params.hash;
		var password = req.body.password;

		return accountsBO.confirmAccount(hashConfirmation, device, password)
		.then(function(resp){
			res.status(resp.code).json(resp.json);
			resolve(resp);
		}).catch(function(err) {
			var resp = responses.internalError(err);
			res.status(resp.code).json(resp.json);
			resolve(response);
		});
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**
* @description checkIfValidated
* @return if it is authenticated already
*/
router.get('/authentication/:hash', function(req, res, next) {
	return new Promise(function(resolve, reject){
		if (req.useragent.isBot === true ) reject(new response(400, "Bot", 1));
		var hashConfirmation = req.params.hash;

		return accountsBO.findWithHash(hashConfirmation)
		.then(function(resp){
			res.status(resp.code).json(resp.json);
			resolve(resp);
		}).catch(function(err) {
			var resp = responses.internalError(err);
			res.status(resp.code).json(resp.json);
			resolve(response);
		}).catch(function(err) {
			var resp = responses.internalError(err);
			res.status(resp.code).json(resp.json);
			resolve(response);
		});
	});
});

/**
* @description logIn. <tt>email</tt> is used to identify the user.
*/
router.post('/authentication', function(req, res) {
	return new Promise(function (resolve, reject) {
		if (req.body.user === undefined) reject(responses.missingParameters('email'));
		else if (req.body.password === undefined) reject(responses.missingParameters('password'));
		var email = req.body.user;
		var password = req.body.password;
		var populate = req.query.populate;

		return accountsBO.logIn(email, password, req.device, populate)
		.then(function(resp) {
			res.status(resp.code).json(resp.json);
			resolve(resp);
		}).catch(function(err){
			var resp = responses.internalError(err);
			res.status(resp.code).json(resp.json);
			resolve(response);
		});
	}).catch(function(err){
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**
* @description logout
*/
router.delete('/authentication', function(req, res){
	return new Promise (function (resolve, reject){

		if (req.rawToken === undefined) reject(responses.missingParameters('rawToken'));
		if (req.token === undefined) reject(responses.missingParameters('token'));

		return accountsBO.logout(req.device, req.rawToken, req.token)
		.then(function(resp){
			res.status(resp.code).json(resp.json);
			resolve(resp);
		}).catch(function(err){
			var resp = responses.internalError(err);
			res.status(resp.code).json(resp.json);
			resolve(response);
		});
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

module.exports = router;
