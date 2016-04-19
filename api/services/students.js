/**
* Amadeu Cavalcante
* Module services
*/

var models = require('../models');

//errors and validator's module
var errors = require('../services/errors');
var validator = require('validator');

var studentsServices = {
	create: function(parameters) {
		return models.waterline.collections.student.create({
			name: parameters.student.name,
			surname: parameters.student.surname,
			birthdate: parameters.student.birthdate,
			gender: parameters.student.gender,
			school: parameters.schoolID,
			classroom: parameters.classroomID
		})
		.then(function(student) {
			if (!student) throw errors.internalError('Student - Creation Error');
			return models.waterline.collections.room.findOne({id: parameters.classroomID})
			.then(function(classroom){
				if (!classroom) throw errors.inexistentRegister('Classroom - Finding Error');
				//console.log(classroom);
				classroom.students.add(student.id);
				return classroom.save()
				.then(function(){
					return ({student: student.id});
				});
			});
		});
	},
	delete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.student.findOne(parameters).populate('guardians')
		.then(function(student) {
			if (!student) throw errors.inexistentRegister('Student - Finding Error');
			student.active = false;
			return student.save();
		});
	},
	update: function(parameters, newParameters) {
		if (!parameters || !parameters ) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.student.updated(parameters, newParameters)
		.then(function(students) {

		});
	},
  read: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.student.findOne(parameters)
		.then(function(student) {
			if(!student) return undefined;
			return student;
		});
  },
	addGuardian: function(parameters, guardian_id) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.student.findOne(parameters).populate('guardians')
		.then(function(student) {
			if(!student) throw errors.inexistentRegister('Student - Finding Error');
			student.guardians.add(guardian_id);
			return student.save();
		});
	},
	readComplete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.student.findOne(parameters).populate(['school', 'guardians', 'posts', 'room'])
		.then(function(student) {
			if(!student) return undefined;
			return student;
		});
	}
};

module.exports = studentsServices;
