/** @module routes/contents */

var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var contentsBO = require('../business/contents.js');
var multiparty = require('multiparty');

/**@description downloads a file */
router.get("/:key", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			contentsBO.downloadContent(req.params.key, req.device, req.rawToken, req.token)
			.then(function(resp){
				resolve(resp);
			}).catch(function(err) {
				reject(err);
			});
		}
	}).then(function(resp) {
		if (resp instanceof response) {
			res.status(resp.code).json(resp.json);
		} else {
			resp.pipe(res);
		}
	}).catch(function(err) {
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**@description uploads a file */
router.post("/", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
			var data;
			var school;
			var profile;
			
			var form = new multiparty.Form();
			
			form.on('error', function(err) {
				resolve(responses.badForm(err));
			});
			
			form.on('field', function(name, value) {
				if (name === 'school') {
					school = value;
				} else if (name === 'profile') {
					profile = value;
				}
			});
			
			form.on('part', function(part) {
				if (!part.filename) {
					part.resume();
					return;
				}
				else if (part.name !== "data") {
					part.resume();
					return;
				}
				else data = part;
			});
			
			form.on('close', function() {
				var missingPostParameters = [];
				if (data === undefined) missingParameters.push("data");
				if (school === undefined && profile === undefined) missingParameters.push("owner");
				if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
				else contentsBO.uploadContent(profile, school, part, req.device, req.rawToken, req.token)
				.then(function(result) {
					resolve(result);
				})
				.catch(function(err) {
					reject(err);
				});
			});
			
			form.parse(req);
		}
	}).then(function(err) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err){
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/**@description deletes a file */
router.delete("/:key", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			contentsBO.deleteContent(req.params.key, req.device, req.rawToken, req.token)
			.then(function(resp){
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
