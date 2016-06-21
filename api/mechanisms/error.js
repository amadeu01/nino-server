/**
* @author: Carlos Eduardo Millani
* @module mechanisms
*/

var response = require('./response.js');

module.exports = {
	//Register related errors
	inexistentRegister: function(data) {
		return new response(404, data, 100);
	},
	deletedRegister: function(data) {
		return new response(404, data, 101);
	},

	//Server related errors
	invalidParameters: function(data) {
		return new response( 400, data, 200);
	},
	internalError: function(data) {
		return new response( 500, data, 201);
	},

	//Token related errors
	invalidPermissions: function(data) {
		return new response( 403, data, 300);
	},
	invalidCredential: function(data) {
		return new response( 403, data, 301);
	},
	expiredCredential: function(data) {
		return new response( 403, data, 301);
	}
};
