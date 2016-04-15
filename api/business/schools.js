var permissions = require('./permissions');
var errors = require('./errors');
var services = require('../services');

var credentials = require('./credentials');

module.exports = {
	validateIdentity: function(user_id, roles_ids) {
		
	},
	create: function(parameters) {
		return services.schools.create(parameters)
		.then(function(created) {
			return credentials.loginEducator(parameters.owner.email, parameters.owner.password, parameters.device);
		});
	},
	read: function(token, params) {
		
	},
	update: function(token, params) {
		
	},
	delete: function(token, params) {
		
	},
	notificateGuardians: function(token, params) {
		
	},
	notificateEducators: function(token, params) {
		
	},
	updateLogo: function(token, image) {
		
	},
	getLogo: function(token, image) {
		
	}
}