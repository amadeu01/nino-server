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
		if (req.useragent.isBot === true ) resolve(responses.isBot());
		else if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
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
			accountsBO.createNewUser(account, profile)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err){
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**
 * @method  /accounts/authentication/password_reset
 * @description Sends an email to the specified email address on the request with a link to reset the accounts's password
 * @param	email {string}
 * @return	If success, body.error is null. The link is valid for 24 hours from the request.
 */
router.post('/authentication/password_reset', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters=[];
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.email === undefined) missingParameters.push("password");
		if (req.useragent.isBot === true ) resolve(responses.isBot());
		else if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else accountsBO.setLostAccount(req.body.email, req.device)
		.then(function(resp) {
			resolve(resp);
		}).catch(function(err){
			reject(err);
		});

	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**
 * @method /authentication/password_reset/:hash
 * @description Resets the pasword of the account related to the {hash} with the given {password}
 * @param	hash {string}
 * @param	password {string}
 * @return	If success body.data.token id defined and is the token for that user
 */
router.post('/authentication/password_reset/:hash', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters=[];
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.password === undefined) missingParameters.push("password");
		if (req.useragent.isBot === true ) resolve(responses.isBot());
		else if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else accountsBO.recoverAccount(req.params.hash, req.device, req.body.password)
		.then(function(resp) {
			resolve(resp);
		}).catch(function(err){
			reject(err);
		});
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**
* @description confirmAccount
*/
router.post('/authentication/:hash', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.password === undefined) missingParameters.push("password");
		if (req.useragent.isBot === true ) resolve(responses.isBot());
		else if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else accountsBO.confirmAccount(req.params.hash, req.device, req.body.password)
		.then(function(resp){
			resolve(resp);
		}).catch(function(err) {
			reject(err);
		});
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
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
		if (req.useragent.isBot === true ) resolve(responses.isBot());
		else accountsBO.findWithHash(req.params.hash)
		.then(function(resp){
			resolve(resp);
		}).catch(function(err) {
			reject(err);
		});
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**
* @description logIn. <tt>email</tt> is used to identify the user.
*/
router.post('/authentication', function(req, res) {
	return new Promise(function (resolve, reject) {
		if (req.body.user === undefined) resolve(responses.missingParameters('email'));
		else if (req.body.password === undefined) resolve(responses.missingParameters('password'));
		else accountsBO.logIn(req.body.user, req.body.password, req.device)
		.then(function(resp) {
			resolve(resp);
		}).catch(function(err) {
			reject(err);
		});
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
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
		if (req.rawToken === undefined) resolve(responses.missingParameters('rawToken'));
		else if (req.token === undefined) resolve(responses.missingParameters('token'));
		else accountsBO.logout(req.device, req.rawToken, req.token)
		.then(function(resp){
			resolve(resp);
		}).catch(function(err){
			reject(err);
		});
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**
 * @description Set the status for notifications on a specific device
 */
router.put('/notifications/me', function(req, res) {
	return new Promise (function(resolve, reject) {
		if (req.rawToken === undefined) resolve(responses.missingParameters('rawToken'));
		else if (req.token === undefined) resolve(responses.missingParameters('token'));
		else accountsBO.updateNotifications(req.body.deviceToken, req.device, req.rawToken, req.token, req.useragent.isiPhone | req.useragent.isiPod | req.useragent.isiPad, req.useragent.isAndroid, req.headers.host)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

module.exports = router;
