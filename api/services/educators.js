/**
* Carlos Millani
* Module services
*/

var models = require('../models');
var Users = models.waterline.collections.user;
var Educators = models.waterline.collections.educator;
var Roles = models.waterline.collections.role;
var Devices = models.waterline.collections.device;
var Credentials = models.waterline.collections.credential;

var validator = require('validator');

var educatorServices = {
	create: function(parameters) {
		if (!validator.isEmail(parameters.user.email)) throw 'Invalid School Mail'; //TODO Replace with real error

		return Users.create({
				name: parameters.user.name,
				surname: parameters.user.surname,
				password: parameters.user.password,
				email: parameters.user.email,
				cel: parameters.user.cel
		})
		.then(function(user) {
			if (!user) throw 'Error'
			return Roles.create({
				type: 'educator',
				privileges: parameters.privileges, //TODO: set to all
				owner: user.id
			});
		})
		.then(function(role) {
			if (!role) throw 'Error'
			return Educators.create({
				role: role.id,
				school: parameters.schoolID
			});
		})
		.then(function(educator) {
			if (!educator) throw 'Error'
			return ({educator: educator.id});
		});
	},
	delete: function(parameters) {
		if (!parameters) throw 'Error'
		return Educators.findOne(parameters)
		.then(function(educator) {
			if (!educator) throw 'Error'
			educator.active = false;
			educator.save()
			return Roles.findOne({id: educator.role});
		})
		.then(function (role) {
			role.active = false;
			return role.save();
		})
	},
	update: function(parameters, newParatemers, roleParameters) {
		if (!parameters || !newParatemers || !roleParameters) throw 'Error'
		parameters.active = true;
		return Educators.update(parameters, newParatemers)
		.then(function(educator) {
			if (!educator) throw 'Error'
			return Roles.findOne({id: educator[0].role});
		})
		.then(function(role) {
			if (!role) throw 'Error'
			return Roles.update({id: role.id}, roleParameters);
		})
	},
	read: function(parameters) {
		if (!parameters) throw 'Error'
		parameters.active = true;
		return Educators.findOne(parameters)
		.then(function (educator) {
			if (!educator) return undefined
			return Roles.findOne({id: educator.role}).populate('owner');
		});
	},
	readAllFromSchool: function(parameters) {
		if (!parameters) throw 'Error'
		parameters.active = true;
		return Educators.find(parameters)
		.then(function(educators) {
			if (!educators) return undefined
			var newList = educators.map(function(educator) {
				if (!educator) return undefined
				return educator.role;
			});
			return Roles.find({id: newList}).populate('owner');
		});
	}
};

module.exports = educatorServices;
