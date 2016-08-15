/** @module routes/agendas */

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

router.param('class_id', numberValidate);

router.post('/classes/:class_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.agenda === undefined) missingParameters.push("device");
		if (req.useragent.isBot === true ) reject(responses.isBot());
		else if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
		//Provided that all the needed parameters are there, we call business to validate them
			return agendasBO.createAgendaForClass(account, profile)
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

module.exports = router;