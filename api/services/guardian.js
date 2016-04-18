/**
* Amadeu Cavalcante
* Module services
* Last to modified: Amadeu Cavalcante
*/

var models = require('../models');
var Users = models.waterline.collections.user;
var Guardians = models.waterline.collections.guardian;
var Roles = models.waterline.collections.role;
var Devices = models.waterline.collections.device;
var Credentials = models.waterline.collections.credential;

//errors and validator's module
var errors = require('../business/errors');
var validator = require('validator');

var guardiansServices = {
	create: function(parameters) {
		if (!validator.isEmail(parameters.user.email)) throw errors.invalidParameters('Invalid User email');

		return Users.create({
				name: parameters.user.name,
				surname: parameters.user.surname,
				password: parameters.user.password,
				email: parameters.user.email,
				cel: parameters.user.cel
		})
		.then(function(user) {
			if (!user) throw errors.internalError('User - Creation Error');
			return Roles.create({
				type: 'guardian',
				privileges: parameters.privileges,
				owner: user.id
			});
		})
		.then(function(role) {
			if (!role) throw errors.internalError('Role - Creation Error');
			return Guardians.create({
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
		return Guardians.findOne(parameters)
		.then(function(guardian) {
			if (!guardian) throw errors.inexistentRegister('Guardian - Finding Error');
			guardian.active = false;
			guardian.save();
			return Roles.findOne({id: guardian.role});
		})
		.then(function (role) {
			role.active = false;
			return role.save();
		});
	},
	read: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Guardians.findOne(parameters)
		.then(function (guardian) {
			if (!guardian) return undefined;
			return Roles.findOne({id: guardian.role}).populate('owner');
		});
	},
	update: function(parameters, newParameters, roleParameters) {
		if (!parameters || !newParameters || !roleParameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Guardians.update(parameters, newParameters)
		.then(function(guardian) {
			if (!guardian) throw errors.inexistentRegister('Educator - Finding Error');
			return Roles.findOne({id: guardian[0].role});
		})
		.then(function(role) {
			if (!role) throw errors.inexistentRegister('Role - Finding Error');
			return Roles.update({id: role.id}, roleParameters);
		});
	},
	addStudent: function(parameters, student_id) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return Guardians.findOne(parameters).populate('students')
		.then(function(guardian) {
			if (!guardian) throw errors.inexistentRegister('Guardian - Finding Error');
			guardian.students.add(student_id);
			return guardian.save();
		});
	},
	description: function(parameters){
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Guardians.findOne(parameters)
		.then(function (guardian) {
			if (!guardian) return undefined;
			return Roles.findOne({id: guardian.role}).populate('owner').
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
