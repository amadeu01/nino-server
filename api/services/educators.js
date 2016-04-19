/**
* Carlos Millani
* Module services
* Last to modified: Amadeu Cavalcante
*/

var models = require('../models');

var errors = require('../services/errors');
var validator = require('validator');

var educatorServices = {
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
				type: 'educator',
				privileges: parameters.privileges,
				owner: user.id
			});
		})
		.then(function(role) {
			if (!role) throw errors.internalError('Role - Creation Error');
			return models.waterline.collections.educator.create({
				role: role.id,
				school: parameters.schoolID
			});
		})
		.then(function(educator) {
			if (!educator) throw errors.internalError('Educator - Creation Error');
			educator.rooms.add(parameters.classroomID);
			return educator.save()
			.then(function(){
				return ({educator: educator.id});
			});
		});
	},
	delete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.educator.findOne(parameters)
		.then(function(educator) {
			if (!educator) throw errors.inexistentRegister('Educator - Finding Error');
			educator.active = false;
			educator.save();
			return models.waterline.collections.role.findOne({id: educator.role});
		})
		.then(function (role) {
			role.active = false;
			return role.save();
		});
	},
	update: function(parameters, newParameters, roleParameters) {
		if (!parameters || !newParameters || !roleParameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.educator.update(parameters, newParameters)
		.then(function(educator) {
			if (!educator) throw errors.inexistentRegister('Educator - Finding Error');
			return models.waterline.collections.role.findOne({id: educator[0].role});
		})
		.then(function(role) {
			if (!role) throw errors.inexistentRegister('Role - Finding Error');
			return models.waterline.collections.role.update({id: role.id}, roleParameters);
		});
	},
	read: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.educator.findOne(parameters)
		.then(function (educator) {
			if (!educator) return undefined;
			return models.waterline.collections.role.findOne({id: educator.role}).populate('owner');
		});
	},
	readComplete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.educator.findOne(parameters).populate(['rooms', 'role', 'school'])
		.then(function (educator) {
			if (!educator) throw errors.inexistentRegister('Educator - Finding Error');
			return models.waterline.collections.role.findOne({id: educator.role.id}).populate('owner')
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
		return models.waterline.collections.educator.find(parameters)
		.then(function(educators) {
			if (!educators) return undefined;
			var newList = educators.map(function(educator) {
				if (!educator) return undefined;
				return educator.role;
			});
			return models.waterline.collections.role.find({id: newList}).populate('owner');
		});
	},
	description: function(parameters){
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.educator.findOne(parameters)
		.then(function (educator) {
			if (!educator) return undefined;
			return models.waterline.collections.role.findOne({id: educator.role}).populate('owner').
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
