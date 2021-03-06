var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var validator = require('validator');
var draftsBO = require('../business/drafts.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(responses.invalidParameters("path_isNaN"));
	}
};

router.post('/', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.message === undefined) missingParameters.push("school");
		if (req.body.school === undefined) missingParameters.push("message");
		if (req.body.type === undefined) missingParameters.push("message");
		if (req.body.profiles === undefined) missingParameters.push("profiles");
		if (req.body.school === undefined) missingParameters.push("school");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			var draft = {
				message: req.body.message,
				attachment: req.body.attachment,
				type: req.body.type,
				metadata: req.body.metadata,
				school: req.body.school
			};
			draftsBO.create(draft, req.token.profile, req.body.profiles, req.device, req.rawToken, req.token)
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

router.get('/schools/:school_id/profiles/:profile_id', function(req, res) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			var query = {
				profile_id: req.params.profile_id,
				school_id: req.params.school_id,
				offset: req.query.offset | 0,
				limit: req.query.limit | 10, 
				type: req.query.type
			};
			draftsBO.findWithProfileAndSchool(query, req.device, req.rawToken, req.token)
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

router.put('/:draft_id', function(req, res) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.school === undefined) missingParameters.push("school");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			var new_draft = {};
			if (req.body.message !== undefined) new_draft.message = req.body.message;
			if (req.body.attachment !== undefined) new_draft.attachment = req.body.attachment;
			if (req.body.metadata !== undefined) new_draft.metadata = req.body.metadata;
			
			draftsBO.updateDraft(req.params.draft_id, new_draft, req.body.school, req.device, req.rawToken, req.token)
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

router.post('/:draft_id', function(req, res) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.school === undefined) missingParameters.push("school");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			draftsBO.postDraft(req.params.draft_id, req.body.school, req.device, req.rawToken, req.token)
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
