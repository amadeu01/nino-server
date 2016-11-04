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
		return new Response(200, data, null);
	},

	//Register related errors
	/**@method */
	inexistentRegister: function(data) {
		return new Response(200, undefined, 100);
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
		console.log("ERROR>>" + data + "<<");
		return new Response(500, data, 201);
	},
	/**@method */
	missingParameters: function(data) {
		return new Response(400, data, 202);
	},
	badForm: function(date) {
		return new Response(400, data, 204);
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
		if (err.name === 'error') {
			switch (err.code) {
				case "23502":
					return new Response(400, "missing_parameter", 202);
					break;
				case "23505": //Some field already exists
					return new Response(400, "duplicate", 203); //New code here
					break;
				default:
					console.log("ERROR>>" + data + "<<");
					return new Response(500, "unknown", 201); //Default, unknown error
			}
		} else if (err.rowCount === 0){
			return new Response(200, undefined, null);
		} else {
			console.log("ERROR>>" + data + "<<");
			return new Response(500, "unknown", 201); //Default, unknown error
		}
	}
};
