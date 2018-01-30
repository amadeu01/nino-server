var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var guardiansBO = require('../business/guardians.js');
/*Check if parameter is valid id*/
var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(responses.invalidParameters("path_isNaN"));
	}
};


/** @description Get Guardian info*/
router.get('/:guardian_profile_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		//if (req.body.birthdate === undefined) missingParameters.push("birthdate");  //TODO: No need to check for birthdate, optional
		if (req.useragent.isBot === true ) resolve(responses.isBot("Bot"));
		else if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			guardiansBO.read(req.params.school_id, req.params.guardian_profile_id, req.device, req.rawToken, req.token)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
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

/** @description Remove a Guardian*/
router.delete('/:guardian_profile_id/students/:student_profile_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.school_id === undefined) missingParameters.push("school_id");
		//if (req.body.birthdate === undefined) missingParameters.push("birthdate");  //TODO: No need to check for birthdate, optional
		if (req.useragent.isBot === true ) resolve(responses.isBot("Bot"));
		else if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			guardiansBO.delete(req.body.school_id, req.params.guardian_profile_id, req.params.student_profile_id, req.device, req.rawToken, req.token)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
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

/** @description Add a Guardian to a Student */
router.post('/:guardian_id/students/:student_profile_id', function(req, res, next) {

});

/** @description get guardians info */
router.get('/me', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		//if (req.body.birthdate === undefined) missingParameters.push("birthdate");  //TODO: No need to check for birthdate, optional
		if (req.useragent.isBot === true ) resolve(responses.isBot("Bot"));
		else if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			guardiansBO.readMe(req.device, req.rawToken, req.token)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
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


/** @description Create a new Guardian*/
router.post('/', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.school_id === undefined) missingParameters.push("school_id");
		if (req.body.email === undefined) missingParameters.push("email");
		//else if (req.body.cellphone === undefined); //-- not needed now, we dont use it yet
		if (req.body.student_profile_id === undefined) missingParameters.push("student_profile_id");
		//if (req.body.birthdate === undefined) missingParameters.push("birthdate");  //TODO: No need to check for birthdate, optional
		if (req.useragent.isBot === true ) resolve(responses.isBot("Bot"));
		else if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
		//Provided that all the needed parameters are there, we call business to validate them
			var account = {
				email: req.body.email,
			};
			guardiansBO.create(req.body.school_id, account, req.body.student_profile_id, req.device, req.rawToken, req.token)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
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

/** @description Get Guardians to a Student */
router.get('/students/:student_profile_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.params.student_profile_id === undefined) missingParameters.push("student_profile_id");
		//if (req.body.birthdate === undefined) missingParameters.push("birthdate");  //TODO: No need to check for birthdate, optional
		if (req.useragent.isBot === true ) resolve(responses.isBot());
		else if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			guardiansBO.readForStudents(req.params.student_profile_id, req.device, req.rawToken, req.token)
			.then(function(resp) {
				resolve(resp);
			}).catch(function(err) {
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
