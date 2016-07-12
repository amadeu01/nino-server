var express = require('express');
var router = express.Router();
var app = require('../app');
var errors = require('../mechanisms/error');
var response = require('../mechanisms/response.js');
var useragent = require('express-useragent');
var schoolBO = require('../business/schools.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).json(errors.missingParameters("path_isNaN").clean);
	}
};

//Always check all path parameters for NaN error
router.param('school_id', numberValidate);

/* Get School's info. */
router.get('/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.school_id === undefined) missingParameters.push("school_id");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));

		return schoolBO.read(req.params.school_id, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
			resolve(response);
		}).catch(function(err){
			res.status(err.code).json(err.json);
			reject(err);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/** @description Update a School */
router.put('/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.school_id === undefined) missingParameters.push("school_id");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));

		return schoolBO.update(req.params.school_id, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
			resolve(response);
		}).catch(function(err){
			res.status(err.code).json(err.json);
			reject(err);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/** @description Delete a School */
router.delete('/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.school_id === undefined) missingParameters.push("school_id");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));

		return schoolBO.delete(req.params.school_id, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
			resolve(response);
		}).catch(function(err){
			res.status(err.code).json(err.json);
			reject(err);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/** @description Send push notification to all school guardians */
router.post('/:school_id/notifications/guardians', function(req, res, next) {
	//Check parameters
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.school_id === undefined) missingParameters.push("school_id");
		if (req.body.data === undefined) missingParameters.push("data");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));

	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/** @description Send push notification to all school educators */
router.post('/:school_id/notifications/educators', function(req, res, next) {
	//Check parameters
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.params.school_id === undefined) missingParameters.push("school_id");
		if (req.body.data === undefined) missingParameters.push("data");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));

	}).catch(function(err){
		res.status(err.code).json(err.json);
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
	//TODO: amadeu, da uma checada nesse daqui :) acredito que eh o melhor pra fazer depois do login e do cadastro
	//Check parameters
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.body.owner === undefined) missingParameters.push("school");
		if (req.body.addr === undefined) missingParameters.push("addr");
		if (req.body.cnpj === undefined) missingParameters.push("CNPJ");
		//if (req.body.logo === undefined) missingParameters.push("logo");
		if (req.body.name === undefined) missingParameters.push("name");
		if (req.body.telephone === undefined) missingParameters.push("telephone");
		if (req.body.email === undefined ) missingParameters.push("email");
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		//Should now call business
		var device = req.useragent.Platform + " " + req.useragent.OS;
		school = {
			name: req.body.name,
			email: req.body.email,
			owner: req.body.owner,
			addr: req.body.addr,
			logo: req.body.logo,
			telephone: req.body.telephone,
			cnpj: req.body.cnpj
		};

		return schoolBO.create(school, device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
			resolve(response);
		}).catch(function(err){
			res.status(err.code).json(err.json);
			reject(err);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});

});

/* Updates school logotype */
router.put('/:school_id/logotype', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		//Check parameters
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		//if (req.body.image === undefined) missingParameters.push("image - logo");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		var device = req.useragent.Platform + " " + req.useragent.OS;
		return schoolBO.updateLogo(req.body.image, device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
		}).catch(function(err){
			res.status(err.code).json(err.json);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});
});

/** @description Reads school logotype */
router.get('/:school_id/logotype', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		//Check parameters
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		//if (req.body.image === undefined) missingParameters.push("image - logo");

		if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
		var device = req.useragent.Platform + " " + req.useragent.OS;
		return schoolBO.readLogo(req.body.image, device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
		}).catch(function(err){
			res.status(err.code).json(err.json);
		});
	}).catch(function(err){
		res.status(err.code).json(err.json);
	});

});

module.exports = router;
