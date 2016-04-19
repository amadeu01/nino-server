/**
* Author: Carlos Eduardo Millani
* Classroom business
* Last to modified:
*/
var permissions = require('./permissions');
var errors = require('./errors');
var services = require('../services');

module.exports = {
	validateIdentity: function(user_id, role_id, target, action) {
		return services.educators.read({role: role_id})
		.then(function(educator) {
			return services.roles.read({id: role_id})
			.then(function(role) {
				return services.classrooms.read({id: target})
				.then(function(classroom) {
					if (educator.school != classroom.school) {
						//Token error
					} else if (!permissions.check(role.privileges, action)) {
						//Permission error
					} else {
						//Ok, return :)
					}
				})
			});
		});
		//To edit a classroom must be: educator, same school and have permission
	}
}
