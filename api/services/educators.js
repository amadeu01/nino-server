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
			return Roles.create({
				type: 'educator',
				privileges: parameters.privileges, //TODO: set to all
				owner: user.id
			});
		})
		.then(function(role) {
			return Educators.create({
				role: role.id,
				school: parameters.schoolID
			});
		})
		.then(function(educator) {
			return ({educator: educator.id});
		});
	},
	delete: function(parameters) {
		return Educators.findOne(parameters)
		.then(function(educator) {
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
		parameters.active = true;
		return Educators.update(parameters, newParatemers)
		.then(function(educator) {
			return Roles.findOne({id: educator[0].role});
		})
		.then(function(role) {
			return Roles.update({id: role.id}, roleParameters);
		})
	},
	read: function(parameters) {
		parameters.active = true;
		return Educators.findOne(parameters)
		.then(function (educator) {
			if (educator) return Roles.findOne({id: educator.role}).populate('owner');
			else return undefined;
		});
	},
	readAllFromSchool: function(parameters) {
		parameters.active = true;
		return Educators.find(parameters)
		.then(function(educators) {
			var newList = educators.map(function(educator) {
				return educator.role;
			});
			return Roles.find({id: newList}).populate('owner');
		});
	}
};

module.exports = educatorServices;
