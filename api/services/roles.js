/**
* Carlos Millani
* Module services
*/

var models = require('../models');
var Users = models.waterline.collections.user;
var Educators = models.waterline.collections.educator;
var Roles = models.waterline.collections.role;
var errors = require('../business/errors');

var validator = require('validator');
var permissions = require('../business/permissions');

var roleServices = {
	create: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		Roles.create({
			type: parameters.type,
			privileges: parameters.privileges,
			owner: parameters.owner
		}).then(function(role){
			if (!role) throw errors.internalError('Roles - Creation Error');
			return ({role: role.id});
		});
	},
	delete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Roles.findOne(parameters)
		.then(function(role){
			if (!role) throw errors.inexistentRegister('Roles - Finding Error');
			role.active = false;
			return role.save();
		});
	},
	update: function(parameters, newParatemers) {
		if (!parameters || !newParatemers) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Roles.update(parameters, newParatemers)
		.then(function(roles){
			if (!roles) throw errors.inexistentRegister('Roles - Finding Error');
			return roles;
		});
	},
	read: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Roles.findOne(parameters).populate('owner')
		.then(function(role){
			if (!role) throw errors.inexistentRegister('Roles - Finding Error');
			return role;
		});
	}
};

module.exports = roleServices;
