/**
* Amadeu Cavalcante
* Module services
*/

var models = require('../models');
var Classrooms = models.waterline.collections.classroom;

//errors and validator's module
var errors = require('../business/errors');
var validator = require('validator');

var classroomServices = {
	create: function(parameters) {
    return Classrooms.create({
      name: parameters.classroom.name,
      school: parameters.school
    })
    .then(function(classroom) {
      if (!classroom) throw errors.internalError('Classroom - Creation Error');
      return ({classroom: classroom.id});
    });
	},
	delete: function(parameters) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    return Classrooms.findOne(parameters)
    .then(function(classroom) {
      if (!classroom) throw erros.inexistentRegister('Classroom - Finding Error');
      classroom.active = false;
      return classroom.save();
    });
	},
	update: function(parameters, newParameters) {
    if (!parameters || !newParameters ) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
    return Classrooms.update(parameters, newParameters)
    .then(function(classroom) {
      if (!classroom) throw errors.inexistentRegister('Classroom - Finding Error');
      return;
    });
	},
  read: function(parameters) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
    return Classrooms.findOne(parameters)
    .then(function(classroom) {
      if (!classroom) return undefined;
      return;
    });
  },
  readAllStudents: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Classrooms.findOne(parameters).populate('students')
		.then (function (classroom) {
			if (!classroom) return undefined;
			if (!classroom.students) return undefined;
			return classroom.students;
		});
	},
  readAllEducators: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Classrooms.findOne(parameters).populate('educators')
		.then (function (classroom) {
			if (!classroom) return undefined;
			if (!classroom.educators) return undefined;
			return classroom.educators;
		});
  },
	readComplete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return Classrooms.findOne(parameters).populate(['educators', 'students', 'school'])
		.then(function(classroom){
			if (!classroom) return undefined;
			return classroom;
		});
	}

};

module.exports = classroomServices;
