/** @module routes/accounts */

var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
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

	//Check if needed params exists
	return new Promise(function(resolve, reject) {
		if (req.body.email === undefined) reject(errors.missingParameter('email'));
		// else if (req.body.cellphone === undefined); //-- not needed now, we dont use it yet
		else if (req.body.name === undefined) reject(errors.missingParameter('name'));
		else if (req.body.surname === undefined) reject(errors.missingParameter('surname'));
		else if (req.body.birthdate === undefined) reject(errors.missingParameter('birthdate'));
		else if (req.useragent.isBot === true ) reject(new response(400), "Bot");

		//Provided that all the needed parameters are there, we call business to validate them
		var account = {
			email: req.body.email,
			cellphone: req.body.cellphone,
			password: req.body.password
			//TODO: Password nao é inserido aqui mais
		};

		var profile = {
			name: req.body.name,
			surname: req.body.surname,
			birthdate: req.body.birthdate,
			gender: req.body.gender
		};
		var device = req.useragent.Platform + " " + req.useragent.OS;
		//TODO: Aqui nao precisa do device :v


		return accountsBO.createNewUser(account, profile);

	})
	.then(function(response) {
		res.status(response.status).json(response.json);
	}).catch(function(error) {
		res.status(error.status).json(error.json);
	});
});
/** @description confirmAccount
*/
router.post('/authentication/:hash', function(req, res, next) {
	return new Promise(function(resolve, reject){
		if (req.useragent.isBot === true ) reject(new response(400), "Bot");
		var origin = req.useragent.Platform + " " + req.useragent.OS;
		var hashConfirmation = req.params.hash;
		//TODO: Preciso passar a senha para o accountsBO
		//TODO: aqui é acocuntsBO, não DAO, certo?
		return accountsDAO.confirmAccount(hashConfirmation, origin);
	})
	.then(function(response){
		res.status(response.status).json(response.json);
		resolve(response);
	}).catch(function(err) {
		res.status(err.status).json(err.json);
		reject(new response(400), 'confirmAccount');
	})
});
//TODO: Tem um routes.post em / ali em cima tb, acho que ta duplicado :v
router.post('/', function(req, res, next) {

	return new Promise(function (resolve, reject){

	})
	.then(function(response){

	}).catch(function(err){
		res.status(err.status).json(err.json);
	})
});
/**
* @description login
*/
router.post('/user/:user/:hash/*', function(req, res) {
	return new Promise(function (resolve, reject) {
		var device = req.useragent.Platform + " " + req.useragent.OS;
		var email = req.params.user;
		var password = req.params.hash;
		var populate = req.query.populate;
		//TODO: aqui ele chama o BO de novo, não?
		return accountsDAO.login(email, password, device, populate);
	})
	.then(function(response) {
		res.status(response.status).json(response.json);
		resolve(response)
	}).catch(function(err){
		res.status(err.status).json(err.json);
		reject(new response(400), 'Login');
	});
});

router.post('/logout', function(req, res){

});

module.exports = router;
