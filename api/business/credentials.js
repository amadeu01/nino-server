/**
* Author: Carlos Eduardo Millani
* Credential business
* Last to modified:
*/
var permissions = require('./permissions');
var errors = require('./errors');
var services = require('../services');

var jwt = require('./jwt');

module.exports = {
	validateIdentity: function(user_id, roles_ids) {

	},
	loginEducator: function(email, password, device) {
		return services.users.read({email: email})
		.then(function(user) {
			if (user.password === password) {
				return services.roles.read({owner: user.id, type: 'educator'})
				.then(function(role) {
					if (role) {
						return jwt.create({user: user.id, role: role})
						.then(function(token) {
							return services.credentials.create(device, token, user.id)
							.then(function() {
								return token
							});
						});
					} else {
						throw(errors.inexistentRegister('Inexistent role for user'));
					}
				})
			} else {
				throw(errors.invalidParameters('Incorrect username or password'));
			}
		})
	},
	loginGuardian: function(email, password, device) {
		return services.users.read({email: email})
		.then(function(user) {
			if (user.password === password) {
				return services.roles.read({owner: user.id, type: 'guardian'})
				.then(function(role) {
					if (role) {
						return jwt.create({user: user.id, role: role})
						.then(function(token) {
							return services.credentials.create(device, token, user.id)
							.then(function() {
								return token
							});
						});
					} else {
						throw(errors.inexistentRegister('Inexistent role for user'));
					}
				})
			} else {
				throw(errors.invalidParameters('Incorrect username or password'));
			}
		})
	},
	logout: function(token) {

	}
}
