var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var postsBO = require('../business/posts.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(responses.invalidParameters("path_isNaN"));
	}
};

/**
 * @description Create a new post
*/
router.post('/', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.body.message === undefined) missingParameters.push("message");
		if (req.body.type === undefined) missingParameters.push("message");
		if (req.body.school_id === undefined) req.body.school_id = null;
		if (req.body.class_id === undefined) req.body.class_id = null;
		if (req.body.room_id === undefined) req.body.room_id = null;
		if ( req.body.room_id === undefined && req.body.school_id === undefined && req.body.class_id === undefined && req.body.profiles === undefined) missingParameters.push("receiver");
		if (req.body.author_profile_id === undefined) missingParameters.push("author_profile_id");
		//if (req.body.students === undefined) missingParameters.push("students");
		if (req.body.profiles === undefined || req.body.profiles === NULL ) {
			req.body.profiles = [];
		}

		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
			var post = {
				message: req.body.message,
				// attachment: req.body.attachment,
				school: req.body.school_id,
				class: req.body.class,
				room: req.body.room,
				type: req.body.type
			};

			return postsBO.create(post, req.body.author_profile_id, req.body.profiles, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(classes);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});

/**
 * @description Update a post
*/
router.put('/:post_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");

		if (req.body.profiles === undefined || req.body.profiles === NULL ) {
			req.body.profiles = [];
		}

		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
			var post = {
				id: req.params.post_id,
				message: req.body.message,
				// attachment: req.body.attachment,
				school: req.body.school_id,
				class: req.body.class,
				room: req.body.room,
				type: req.body.type
			};

			return postsBO.update(post, req.body.author_profile_id, req.body.profiles, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(classes);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});


/**
 * @description Delete a post
*/
router.delete('/:post_id', function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");

		if (req.body.profiles === undefined || req.body.profiles === NULL ) {
			req.body.profiles = [];
		}

		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {


			return postsBO.update(req.params.post_id, req.body.author_profile_id, req.body.profiles, req.device, req.rawToken, req.token)
			.then(function(resp){
				res.status(resp.code).json(resp.json);
				resolve(classes);
			}).catch(function(err){
				var resp = responses.internalError(err);
				res.status(resp.code).json(resp.json);
			});
		}
	}).catch(function(err){
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/** @description get post's for profile
*/
router.get("/profiles/:profiles_id/schools/:school_id", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.params.profile_id === undefined ) missingParameters.push("profile_id");
		if (req.params.school_id === undefined ) missingParameters.push("school_id");

		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {


			return profileBO.readForProfile(req.params.school_id, req.params.profile_id, req.device, req.rawToken, req.token)
			.then(function(resp) {
				if (resp instanceof Response) {
					res.status(resp.code).json(resp.json);
				} else {
					resp.pipe(res);
				}
			}).catch(function(err) {
				var resp = responses.internalError(err);
				res.status(resp.code).json(resp.json);
				resolve(resp);
			});
		}
	}).catch(function(err){
		//console.log(err);
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/** @description get who has read
*/
router.get("/:post_id/read/schools/school_id", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.params.school_id === undefined ) missingParameters.push("school_id");
		if (req.params.post_id === undefined ) missingParameters.push("post_id");

		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {


			return profileBO.readForProfile(req.params.school_id, req.params.post_id, req.device, req.rawToken, req.token)
			.then(function(resp) {
				if (resp instanceof Response) {
					res.status(resp.code).json(resp.json);
				} else {
					resp.pipe(res);
				}
			}).catch(function(err) {
				var resp = responses.internalError(err);
				res.status(resp.code).json(resp.json);
			});
		}
	}).catch(function(err){
		//console.log(err);
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

/** @description get who has read
*/
router.put("/:post_id/read/schools/school_id", function(req, res, next) {
	return new Promise(function(resolve, reject){
		var missingParameters = [];
		if (req.token === undefined ) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (req.params.school_id === undefined ) missingParameters.push("school_id");
		if (req.params.post_id === undefined ) missingParameters.push("post_id");
		if (req.body.reader_profile_id === undefined) missingParameters.push("reader");

		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {


			return profileBO.readForProfile(req.params.school_id, req.params.post_id, req.body.reader_profile_id, req.device, req.rawToken, req.token)
			.then(function(resp) {
				if (resp instanceof Response) {
					res.status(resp.code).json(resp.json);
				} else {
					resp.pipe(res);
				}
			}).catch(function(err) {
				var resp = responses.internalError(err);
				res.status(resp.code).json(resp.json);
			});
		}
	}).catch(function(err){
		//console.log(err);
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});
module.exports = router;
