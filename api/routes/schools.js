var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var useragent = require('express-useragent');
var schoolBO = require('../business/schools.js');
var multiparty = require('multiparty');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).json(responses.missingParameters("path_isNaN").clean);
	}
};

//Always check all path parameters for NaN error
router.param('school_id', numberValidate);

/** @description Get School that token profile works for. */
router.get('/me', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else schoolBO.read_me(req.device, req.rawToken, req.token)
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

/** @description Get School's info. */
router.get('/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else schoolBO.read(req.params.school_id, req.device, req.rawToken, req.token)
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

/** @description Update a School */
//TODO: what will be updated ?
router.put('/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			school = { //it could be undefined, must be check what will be updated
				name: req.body.name,
				email: req.body.email,
				owner: req.body.owner,
				addr: req.body.addr,
				telephone: req.body.telephone,
				cnpj: req.body.cnpj
			};
			schoolBO.update(req.params.school_id, school, req.device, req.rawToken, req.token)
			.then(function(resp){
				resolve(resp);
			}).catch(function(err){
				reject(err);
			});
		}
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/** @description Delete a School */
router.delete('/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else schoolBO.delete(req.params.school_id, req.device, req.rawToken, req.token)
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

/** @description Create new school
* @param Owner {id}
* @param Addr {string}
* @param Cnpj {int}
* @param Logo {link}
* @param Telephone {int}
* @param Name {string}
* @param Email {string}
* @return School {id}
*/
router.post('/', function(req, res, next) {
	//Check parameters
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.body.addr === undefined) missingParameters.push("addr");
		//if (req.body.cnpj === undefined) missingParameters.push("CNPJ");
		//if (req.body.logo === undefined) missingParameters.push("logo");
		if (req.body.name === undefined) missingParameters.push("name");
		if (req.body.telephone === undefined) missingParameters.push("telephone");
		if (req.body.email === undefined ) missingParameters.push("email");
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			school = {
				name: req.body.name,
				email: req.body.email,
				address: req.body.addr,
				logo: req.body.logo,
				telephone: req.body.telephone,
				cnpj: req.body.cnpj
			};
			schoolBO.create(school, req.device, req.rawToken, req.token)
			.then(function(resp){
				resolve(resp);
			}).catch(function(err){
				reject(err);
			});
		}
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

module.exports = router;
