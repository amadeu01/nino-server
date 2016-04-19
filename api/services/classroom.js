/**
* Amadeu Cavalcante
* Module services
*/

var models = require('../models');

//errors and validator's module
var errors = require('../services/errors');
var validator = require('validator');

var classroomServices = {
	create: function(parameters) {
    return models.waterline.collections.classroom.create({
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
    return models.waterline.collections.classroom.findOne(parameters)
    .then(function(classroom) {
      if (!classroom) throw erros.inexistentRegister('Classroom - Finding Error');
      classroom.active = false;
      return classroom.save();
    });
	},
	update: function(parameters, newParameters) {
    if (!parameters || !newParameters ) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
    return models.waterline.collections.classroom.update(parameters, newParameters)
    .then(function(classroom) {
      if (!classroom) throw errors.inexistentRegister('Classroom - Finding Error');
      return;
    });
	},
  read: function(parameters) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
    return models.waterline.collections.classroom.findOne(parameters)
    .then(function(classroom) {
      if (!classroom) return undefined;
      return;
    });
  },
  readAllStudents: function(parameters) {//id classroom
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.classroom.findOne(parameters).populate('students')
		.then (function (classroom) {
			if (!classroom) return undefined;
			if (!classroom.students) return undefined;
			//console.log(classroom);
			return classroom.students;
		});
	},
  readAllEducators: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.classroom.findOne(parameters).populate('educators')
		.then (function (classroom) {
			if (!classroom) return undefined;
			if (!classroom.educators) return undefined;
			return classroom.educators;
		});
  },
	readComplete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.classroom.findOne(parameters).populate(['educators', 'students', 'school'])
		.then(function(classroom){
			if (!classroom) return undefined;
			return classroom;
		});
	},
	addStudent: function(parameters, student_id) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.classroom.findOne(parameters).populate('students')
		.then(function(classroom){
			if (!classroom) throw errors.inexistentRegister('Classroom - Finding Error');
			classroom.students.add(student_id);
			return classroom.save();
		});
	},
	addEducator: function(parameters, educator_id) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.classroom.findOne(parameters).populate('educators')
		.then(function(classroom){
			if (!classroom) throw errors.inexistentRegister('Classroom - Finding Error');
			classroom.educators.add(educator_id);
			return classroom.save();
		});
	}
};

module.exports = classroomServices;
