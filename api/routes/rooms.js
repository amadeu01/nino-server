var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var validator = require('validator');
var roomsBO = require('../business/rooms.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};


/** @description Create a new room to class */
router.post('/classes/:class_id', function(req, res, next) {
	//Check required parameters
	var missingParameters = [];
	if (req.token === undefined) missingParameters.push("token");
	if (req.rawToken === undefined) missingParameters.push("rawToken");
	if (req.params.class_id === undefined) missingParameters.push("class_id");
	if (req.body.room_name === undefined) missingParameters.push("room_name");
	if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
	else {
		var room = {name: req.body.room_name};
		return roomsBO.createToClass(room, req.params.class_id, req.device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
		}).catch(function(err) {
			res.status(err.code).json(err.json);
		});
	}
});

/** @description Update room information */
router.put('/:room_id', function(req, res, next) {
	//Check required parameters
	var missingParameters = [];
	if (req.token === undefined) missingParameters.push("token");
	if (req.rawToken === undefined) missingParameters.push("rawToken");
	if (req.params.room_id === undefined) missingParameters.push("room_id");
	if (req.body.room_name === undefined) missingParameters.push("room_name");
	if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
	else {
		var roomInfo = {
			id: req.params.room_id,
			name: req.body.room_name
		};
		return roomsBO.update(roomInfo, req.device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
		}).catch(function(err) {
			res.status(err.code).json(err.json);
		});
	}
});

/** @description Marks a room for deleting */
router.delete('/:room_id', function(req, res, next) {
	//Only parameter is school_id, already checked
	var missingParameters = [];
	if (req.token === undefined) missingParameters.push("token");
	if (req.rawToken === undefined) missingParameters.push("rawToken");
	if (req.params.room_id === undefined) missingParameters.push("room_id");
	if (req.body.class_id === undefined) missingParameters.push("class_id");
	if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
	else {
		return roomsBO.delete(req.params.room_id, req.body.class_id, req.device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
		}).catch(function(err) {
			res.status(err.code).json(err.json);
		});
	}
});

/** @description Get rooms from class */
router.get('/classes/:class_id', function(req, res, next) {
	var missingParameters = [];
	if (req.token === undefined) missingParameters.push("token");
	if (req.rawToken === undefined) missingParameters.push("rawToken");
	if (req.device === undefined) missingParameters.push("device");
	if (req.params.class_id === undefined) missingParameters.push("class_id");
	if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
	else {
		return roomsBO.getRoomFromClass(req.params.class_id, req.device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
		}).catch(function(err) {
			res.status(err.code).json(err.json);
		});
	}
});

/** @description Add an educator to a room */
router.post('/:room_id/educators/:educator_id', function(req, res, next) {
	var missingParameters = [];
	if (req.token === undefined) missingParameters.push("token");
	if (req.rawToken === undefined) missingParameters.push("rawToken");
	if (req.params.room_id === undefined) missingParameters.push("room_id");
	if (req.params.educator_id === undefined) missingParameters.push("educator_id");
	if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
	else {
		return roomsBO.addEducatorToRoom(req.params.educator_id, req.params.room_id, req.device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
		}).catch(function(err) {
			res.status(err.code).json(err.json);
		});
	}
});

/** @description Remove an educator from a room */
router.delete('/:room_id/educators/:educator_id', function(req, res, next) {
	var missingParameters = [];
	if (req.token === undefined) missingParameters.push("token");
	if (req.rawToken === undefined) missingParameters.push("rawToken");
	if (req.params.room_id === undefined) missingParameters.push("room_id");
	if (req.params.educator_id === undefined) missingParameters.push("educator_id");
	if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
	else {
		return roomsBO.removeStudentFromRoom(req.params.educator_id, req.params.room_id, req.device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
		}).catch(function(err) {
			res.status(err.code).json(err.json);
		});
	}
});

/** @description Add a student to a room */
router.post('/:room_id/students/:student_id', function(req, res, next) {
	var missingParameters = [];
	if (req.token === undefined) missingParameters.push("token");
	if (req.rawToken === undefined) missingParameters.push("rawToken");
	if (req.params.room_id === undefined) missingParameters.push("room_id");
	if (req.params.student_id === undefined) missingParameters.push("student_id");
	if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
	else {
		return roomsBO.addStudentToRoom(req.params.student_id, req.params.room_id, req.device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
		}).catch(function(err) {
			res.status(err.code).json(err.json);
		});
	}
});

/** @description Remove a student from a room */
router.delete('/:room_id/students/:student_id', function(req, res, next) {
	var missingParameters = [];
	if (req.token === undefined) missingParameters.push("token");
	if (req.rawToken === undefined) missingParameters.push("rawToken");
	if (req.params.room_id === undefined) missingParameters.push("room_id");
	if (req.params.student_id === undefined) missingParameters.push("student_id");
	if (missingParameters.length > 0) reject(errors.missingParameters(missingParameters));
	else {
		return roomsBO.removeStudentFromRoom(req.params.student_id, req.params.room_id, req.device, req.rawToken, req.token)
		.then(function(response){
			res.status(response.code).json(response.json);
		}).catch(function(err) {
			res.status(err.code).json(err.json);
		});
	}
});


module.exports = router;
