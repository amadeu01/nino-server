/**
* Carlos Millani
* Module services
*/

var models = require('../models');
var errors = require('../services/errors');
var jwt = require('./jwt');

var credentialServices = {
	create: function(device, token, owner) {
		return models.waterline.collections.device.findOrCreate({description:device}, {description:device, owner: owner})
		.then(function(device) {
			device.credentials.add({token: token, active: true});
			return device.save();
		});
	},
	delete: function(token) {
		return models.waterline.collections.credential.destroy({token: token});
	},
	update: function(token, newToken) {
		return models.waterline.collections.credential.update({token: token}, {token: newToken});
	},
	read: function(token) {
		return models.waterline.collections.credential.findOne({token: token}).populate('device');
	},
	loginEducator: function(email, password, device) {
		return models.waterline.collections.user.findOne({email: email}).populate('roles', {
			where: {
				type: 'educator'
			}
		})
		.then(function(user) {
			if (user.password !== password) {
				throw(errors.invalidParameters('Incorrect username or password'));
			} else if (user.roles.length === 0) {
				throw(errors.inexistentRegister('Inexistent role for user'));
			} else if (user.roles.length !== 1) {
				throw(errors.invalidParameters(user.roles));
			} else {
				return jwt.create({user: user.id, role: user.roles[0].id})
				.then(function(token) {
					return models.waterline.collections.device.findOrCreate({description:device}, {description:device, owner: user.id})
					.then(function(device) {
						device.credentials.add({token: token, active: true});
						return device.save()
						.then(function() {
							return token;
						});
					});
				});
			}
		})
	}
};

module.exports = credentialServices;
