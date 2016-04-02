module.exports = {
	//Register related errors
	inexistentRegister: function(data) {
		return {
			code: 100,
			description: 'The requested register was not found',
			data: data
		}
	},
	deletedRegister: function(data) {
		return {
			code: 101,
			deletedRegister: 'The requested register is inactive',
			data: data
		}
	},
	
	//Server relayed errors
	invalidParameters: function(data) {
		return {
			code: 200,
			description: 'The provided parameters are invalid or missing',
			data: data
		}
	},
	internalError: function(data) {
		return {
			code: 201,
			description: 'An internal error ocurred',
			data: data
		}
	},
	
	//Token related errors
	invalidPermissions: function(data) {
		return {
			code: 300,
			description: 'The provided credential does not have permissions to execute the action',
			data: data
		}
	},
	invalidCredential: function(data) {
		return {
			code: 301,
			description: 'The provided credential is invalid',
			data: data
		}
	},
	expiredCredential: function(data) {
		return {
			code: 302,
			description: 'The provided credential is expired',
			data: data
		}
	},
	unauthorizedCredential: function(data) {
		return {
			code: 303,
			description: 'The provided credential is forbidden to execute the action',
			data: data
		}
	}
}