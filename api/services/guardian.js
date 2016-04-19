/**
* Amadeu Cavalcante
* Module services
* Last to modified: Amadeu Cavalcante
*/

var models = require('../models');

//errors and validator's module
var errors = require('../services/errors');
var validator = require('validator');

var guardiansServices = {
	create: function(parameters) {
		if (!validator.isEmail(parameters.user.email)) throw errors.invalidParameters('Invalid User email');

		return models.waterline.collections.user.create({
				name: parameters.user.name,
				surname: parameters.user.surname,
				password: parameters.user.password,
				email: parameters.user.email,
				cel: parameters.user.cel
		})
		.then(function(user) {
			if (!user) throw errors.internalError('User - Creation Error');
			return models.waterline.collections.role.create({
				type: 'guardian',
				privileges: parameters.privileges,
				owner: user.id
			});
		})
		.then(function(role) {
			if (!role) throw errors.internalError('Role - Creation Error');
			return models.waterline.collections.guardian.create({
				role: role.id
			});
		})
		.then(function(guardian) {
			if (!guardian) throw errors.internalError('Guardian - Creation Error');
			return ({guardian: guardian.id});
		});
	},
	delete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.guardian.findOne(parameters)
		.then(function(guardian) {
			if (!guardian) throw errors.inexistentRegister('Guardian - Finding Error');
			guardian.active = false;
			guardian.save();
			return models.waterline.collections.role.findOne({id: guardian.role});
		})
		.then(function (role) {
			role.active = false;
			return role.save();
		});
	},
	read: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.guardian.findOne(parameters)
		.then(function (guardian) {
			if (!guardian) return undefined;
			return models.waterline.collections.role.findOne({id: guardian.role}).populate('owner');
		});
	},
	update: function(parameters, newParameters, roleParameters) {
		if (!parameters || !newParameters || !roleParameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.guardian.update(parameters, newParameters)
		.then(function(guardian) {
			if (!guardian) throw errors.inexistentRegister('Educator - Finding Error');
			return models.waterline.collections.role.findOne({id: guardian[0].role});
		})
		.then(function(role) {
			if (!role) throw errors.inexistentRegister('Role - Finding Error');
			return models.waterline.collections.role.update({id: role.id}, roleParameters);
		});
	},
	addStudent: function(parameters, student_id) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.guardian.findOne(parameters).populate('students')
		.then(function(guardian) {
			if (!guardian) throw errors.inexistentRegister('Guardian - Finding Error');
			guardian.students.add(student_id);
			return guardian.save();
		});
	},
	description: function(parameters){
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.guardian.findOne(parameters)
		.then(function (guardian) {
			if (!guardian) return undefined;
			return models.waterline.collections.role.findOne({id: guardian.role}).populate('owner').
			then(function(role){
				var data = "Name: " + JSON.stringify(role.owner.name);
				data += "\nSurname: " + JSON.stringify(role.owner.surname);
				data += "\nemail: " + JSON.stringify(role.owner.email);
				data += "\n=================Students====================\n";
				guardian.students.forEach(function(student){
					data += "\nStudent: " + student.id;
					data += "\nName: " + student.name;
					data += "\nSurname:" + student.surname;
					data += "\nBirthdate: " + student.birthdate;
					data += "\nSchool: " + JSON.stringify(student.school);
					data += "\nClassroom: " + JSON.stringify(student.classroom);
					data += "\n ------Next";
				});
				return data;
			});
		});
	}
};

module.exports = guardiansServices;
