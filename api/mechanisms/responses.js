/**
* @author Carlos Millani
* @module mechanisms/response
*/

/** @constructor
* @param code
* @param data {JSON}
* @param error {error}
*/
function Response(code, data, error) {
	this.code = code;
	this.json = {
		data: data,
		error: error
	};
}

module.exports = {
	
	//Success!
	/**@method */
	success: function(data) {
		return new Response(200, date, null);
	},
	
	//Register related errors
	/**@method */
	inexistentRegister: function(data) {
		return new Response(200, data, 100);
	},
	/**@method */
	deletedRegister: function(data) {
		return new Response(200, data, 101);
	},

	//Server related errors
	/**@method */
	invalidParameters: function(data) {
		return new Response(400, data, 200);
	},
	/**@method */
	internalError: function(data) {
		return new Response(500, data, 201);
	},
	/**@method */
	missingParameters: function(data) {
		return new Response(400, data, 202);
	},

	//Token related errors
	/**@method */
	invalidPermissions: function(data) {
		return new Response(403, data, 300);
	},
	/**@method */
	invalidCredential: function(data) {
		return new Response(403, data, 301);
	},
	/**@method */
	expiredCredential: function(data) {
		return new Response(403, data, 302);
	},
	/**@method
	 * @description trigged when a Bot try to send a request
	 */
	isBot: function(data) {
		return new Response(403, data, 303);
	},

	/** @method
	*/
	persistenceError: function(err) {
		if (err.name == 'error') {
			switch (err.code) {
				case 23502:
					return new Response(400, err.detail, 202);
				case 23505:
					return new Response(400, err.detail, 203); //New code here
				default:
					return new Response(500, err.detail, 201); //Default, unknown error
			}
		} else if (err.rowCount === 0){
			return new Response(200, err.rows, 0);
		} else {
			return new Response(500, err.detail, 201); //Default, unknown error
		}
	}
};
