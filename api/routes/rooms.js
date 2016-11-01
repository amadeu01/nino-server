/** @module routes/rooms */

var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var roomsBO = require('../business/rooms.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(responses.invalidParameters("path_isNaN"));
	}
};

/** @description Get a Room */
router.get('/:room_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			roomsBO.getRoom(req.params.room_id, req.device, req.rawToken, req.token)
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

/** @description Create a new room to class */
router.post('/classes/:class_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.body.room_name === undefined) missingParameters.push("room_name");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			var room = {name: req.body.room_name};
			roomsBO.createToClass(room, req.params.class_id, req.device, req.rawToken, req.token)
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

/** @description Update room information */
router.put('/:room_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.body.room_name === undefined) missingParameters.push("room_name");
		if (req.body.school_id === undefined) missingParameters.push("school_id");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			var roomInfo = {
				id: req.params.room_id,
				name: req.body.room_name
			};
			roomsBO.update(req.body.school_id, roomInfo, req.device, req.rawToken, req.token)
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

/** @description Marks a room for deleting */
router.delete('/:room_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.body.class_id === undefined) missingParameters.push("class_id");
		if (req.body.school_id === undefined) missingParameters.push("school_id");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			roomsBO.delete(req.body.school_id, req.params.room_id, req.body.class_id, req.device, req.rawToken, req.token)
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

/** @description Get rooms from class */
router.get('/classes/:class_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			roomsBO.getRoomFromClass(req.params.class_id, req.device, req.rawToken, req.token)
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

/** @description Get rooms from school */
router.get('/schools/:school_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.device === undefined) missingParameters.push("device");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			roomsBO.getRoomFromSchool(req.params.school_id, req.device, req.rawToken, req.token)
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

/** @description Add an educator to a room */
router.post('/:room_id/educators/:educator_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.body.school_id === undefined) missingParameters.push("school_id");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			roomsBO.addEducatorToRoom(req.body.school_id, req.params.educator_id, req.params.room_id, req.device, req.rawToken, req.token)
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

/** @description Remove an educator from a room */
router.delete('/:room_id/educators/:educator_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.body.school_id === undefined) missingParameters.push("school_id");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			roomsBO.removeEducatorFromRoom(req.body.school_id, req.params.educator_id, req.params.room_id, req.device, req.rawToken, req.token)
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

/** @description Add a student to a room */
router.post('/:room_id/students/:student_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.body.school_id === undefined) missingParameters.push("school_id");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			roomsBO.addStudentToRoom(req.body.schoo_id, req.params.student_id, req.params.room_id, req.device, req.rawToken, req.token)
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

/** @description Remove a student from a room */
router.delete('/:room_id/students/:student_id', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (missingParameters.length > 0) resolve(responses.missingParameters(missingParameters));
		else {
			roomsBO.removeStudentFromRoom(req.body.school_id, req.params.student_id, req.params.room_id, req.device, req.rawToken, req.token)
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
