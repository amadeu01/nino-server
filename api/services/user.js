/**
* Amadeu Cavalcante
* Module services
*/

var models = require('../models');

//errors and validator's module
var errors = require('../services/errors');
var validator = require('validator');

var userServices = {
	create: function(parameters) {
    if (!validator.isEmail(parameters.user.email)) throw errors.invalidParameters('Invalid User email');

		return models.waterline.collections.user.create({
				name: parameters.user.name,
				surname: parameters.user.surname,
				password: parameters.user.password,
				email: parameters.user.email,
				cel: parameters.user.cel,
				profile_picture: parameters.user.profile_picture
		})
		.then(function(user) {
			if (!user) throw errors.internalError('User - Creation Error');
			return ({user: user.id});
		});
	},
	delete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.user.findOne(parameters)
		.then(function(user) {
			if (!user) throw errors.inexistentRegister('User - Finding Error');
			user.active = false;
			return user.save();
		});
	},
	update: function(parameters, newParameters) {
		if (!parameters || !newParameters ) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.user.update(parameters, newParameters)
		.then(function(user) {
			if (!user) throw errors.inexistentRegister('User - Finding Error');
			return user;
		});
	},
  read: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.user.findOne(parameters)
		.then(function (user) {
			if (!user) return undefined;
			return user;
		});
  },
  listUsers: function() {//TODO

  },
	addDevice: function(parameters, device_id) {//TODO

	}
};

module.exports = userServices;