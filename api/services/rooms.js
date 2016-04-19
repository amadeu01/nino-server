/**
* Amadeu Cavalcante
* Module services
*/

var models = require('../models');

//errors and validator's module
var errors = require('../services/errors');
var validator = require('validator');

var roomServices = {
	create: function(parameters) {
    return models.waterline.collections.room.create({
      name: parameters.room.name,
      school: parameters.school,
			type: parameters.room.type
    })
    .then(function(room) {
      if (!room) throw errors.internalError('Classroom - Creation Error');
      return ({room: room.id});
    });
	},
	delete: function(parameters) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    return models.waterline.collections.room.findOne(parameters)
    .then(function(room) {
      if (!room) throw errors.inexistentRegister('Classroom - Finding Error');
      room.active = false;
      return room.save();
    });
	},
	update: function(parameters, newParameters) {
    if (!parameters || !newParameters ) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
    return models.waterline.collections.room.update(parameters, newParameters)
    .then(function(room) {
      if (!room) throw errors.inexistentRegister('Classroom - Finding Error');
      return;
    });
	},
  read: function(parameters) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
    return models.waterline.collections.room.findOne(parameters)
    .then(function(room) {
      if (!room) return undefined;
      return;
    });
  },
  readAllStudents: function(parameters) {//id room
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.room.findOne(parameters).populate('students')
		.then (function (room) {
			if (!room) return undefined;
			if (!room.students) return undefined;
			//console.log(room);
			return room.students;
		});
	},
  readAllEducators: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.room.findOne(parameters).populate('educators')
		.then (function (room) {
			if (!room) return undefined;
			if (!room.educators) return undefined;
			return room.educators;
		});
  },
	readComplete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.room.findOne(parameters).populate(['educators', 'students', 'type'])
		.then(function(room){
			if (!room) return undefined;
			return room;
		});
	},
	addStudent: function(parameters, student_id) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.room.findOne(parameters).populate('students')
		.then(function(room){
			if (!room) throw errors.inexistentRegister('Classroom - Finding Error');
			room.students.add(student_id);
			return room.save();
		});
	},
	addEducator: function(parameters, educator_id) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.room.findOne(parameters).populate('educators')
		.then(function(room){
			if (!room) throw errors.inexistentRegister('Classroom - Finding Error');
			room.educators.add(educator_id);
			return room.save();
		});
	}
};

module.exports = roomServices;
