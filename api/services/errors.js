/**
* Author: Carlos Eduardo Millani
* Erros
* Last to modified:
*/

function ninoError(code, description, message, httpCode) {
	this.code = code;
	this.message = message;
	this.description = description;
	this.httpCode = httpCode;
	
	this.clean = {
		code: this.code,
		message: this.message,
		description: this.description
	};
}

module.exports = {
	//Register related errors
	inexistentRegister: function(data) {
		return new ninoError(100, 'The requested register was not found', data, 404);
	},
	deletedRegister: function(data) {
		return new ninoError( 101, 'The requested register is inactive', data, 404);
	},

	//Server related errors
	invalidParameters: function(data) {
		return new ninoError( 200, 'The provided parameters are invalid or missing', data, 400);
	},
	internalError: function(data) {
		return new ninoError( 201, 'An internal error ocurred', data, 500);
	},

	//Token related errors
	invalidPermissions: function(data) {
		return new ninoError( 300, 'The provided credential does not have permissions to execute the action', data, 403);
	},
	invalidCredential: function(data) {
		return new ninoError( 301, 'The provided credential is invalid', data, 403);
	},
	expiredCredential: function(data) {
		return new ninoError( 302, 'The provided credential is expired', data, 403);
	},
	unauthorizedCredential: function(data) {
		return new ninoError( 303, 'The provided credential is forbidden to execute the action', data, 401);
	}
};
