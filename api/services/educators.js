/**
* Carlos Millani
* Module services
* Last to modified: Amadeu Cavalcante
*/

var models = require('../models');
var Users = models.waterline.collections.user;
var Educators = models.waterline.collections.educator;
var Roles = models.waterline.collections.role;
var Devices = models.waterline.collections.device;
var Credentials = models.waterline.collections.credential;

var errors = require('../business/errors');
var validator = require('validator');

var educatorServices = {
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
				type: 'educator',
				privileges: parameters.privileges,
				owner: user.id
			});
		})
		.then(function(role) {
			if (!role) throw errors.internalError('Role - Creation Error');
			return Educators.create({
				role: role.id,
				school: parameters.schoolID
			});
		})
		.then(function(educator) {
			if (!educator) throw errors.internalError('Educator - Creation Error');
			educator.classrooms.add(parameters.classroomID);
			return educator.save()
			.then(function(){
				return ({educator: educator.id});
			});
		});
	},
	delete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return Educators.findOne(parameters)
		.then(function(educator) {
			if (!educator) throw errors.inexistentRegister('Educator - Finding Error');
			educator.active = false;
			educator.save();
			return Roles.findOne({id: educator.role});
		})
		.then(function (role) {
			role.active = false;
			return role.save();
		});
	},
	update: function(parameters, newParameters, roleParameters) {
		if (!parameters || !newParameters || !roleParameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Educators.update(parameters, newParameters)
		.then(function(educator) {
			if (!educator) throw errors.inexistentRegister('Educator - Finding Error');
			return Roles.findOne({id: educator[0].role});
		})
		.then(function(role) {
			if (!role) throw errors.inexistentRegister('Role - Finding Error');
			return Roles.update({id: role.id}, roleParameters);
		});
	},
	read: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Educators.findOne(parameters)
		.then(function (educator) {
			if (!educator) return undefined;
			return Roles.findOne({id: educator.role}).populate('owner');
		});
	},
	readComplete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Educators.findOne(parameters).populate(['classrooms', 'role', 'school'])
		.then(function (educator) {
			if (!educator) throw errors.inexistentRegister('Educator - Finding Error');
			return Roles.findOne({id: educator.role.id}).populate('owner')
			.then(function(role){
				return ({
					educator: educator,
					role: role
				});
			});
		});
	},
	readAllFromSchool: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Educators.find(parameters)
		.then(function(educators) {
			if (!educators) return undefined;
			var newList = educators.map(function(educator) {
				if (!educator) return undefined;
				return educator.role;
			});
			return Roles.find({id: newList}).populate('owner');
		});
	},
	description: function(parameters){
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Educators.findOne(parameters)
		.then(function (educator) {
			if (!educator) return undefined;
			return Roles.findOne({id: educator.role}).populate('owner').
			then(function(role){
				var data = "Name: " + JSON.stringify(role.owner.name);
				data += "\nSurname: " + JSON.stringify(role.owner.surname);
				data += "\nemail: " + JSON.stringify(role.owner.email);
				data += "\nClassroom: " + JSON.stringify(educator.classroom);
				return data;
			});
		});
	}
};

module.exports = educatorServices;
