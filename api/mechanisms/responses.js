/**
* @author Carlos Millani
* @module mechanisms/response
*/

/** @constructor
* @param code {int} Code representation
* @param data {JSON} Information
* @param error {error} Error when exists
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
	/**@method success */
	success: function(data) {
		return new Response(200, data, null);
	},

	//Register related errors
	/**@method inexistentRegister */
	inexistentRegister: function(data) {
		return new Response(200, "undefined", 100);
	},
	/**@method deletedRegister */
	deletedRegister: function(data) {
		return new Response(200, data, 101);
	},

	//Server related errors
	/**@method invalidParameters */
	invalidParameters: function(data) {
		return new Response(400, data, 200);
	},
	/** @method internalError
	 * @param data
	 */
	internalError: function(data) {
		console.log("ERROR>>" + data + "<<");
		return new Response(500, data, 201);
	},
	/** @method missingParameters
	 * @param data
	 */
	missingParameters: function(data) {
		return new Response(400, data, 202);
	},
	/** @method badForm
	 * @param data
	 */
	badForm: function(date) {
		return new Response(400, data, 204);
	},

	//Token related errors
	/** @method invalidPermissions
	 * @param data {String}
	 */
	invalidPermissions: function(data) {
		return new Response(403, data, 300);
	},
	/** @method invalidCredential
	 * @param data {String}
	 */
	invalidCredential: function(data) {
		return new Response(403, data, 301);
	},
	/** @method expiredCredential
	 * @param data {String}
	 */
	expiredCredential: function(data) {
		return new Response(403, data, 302);
	},
	/**@method isBot
	 * @description trigged when a Bot try to send a request
	 * @param data {String}
	 */
	isBot: function(data) {
		return new Response(403, data, 303);
	},

	/** @method persistenceError
	 * @param err {Error} DB error
	*/
	persistenceError: function(err) {
		if (err.name == 'error') {
			switch (err.code) {
				case "23502":
					return new Response(400, "missing_parameter", 202);
				case "23505": //Some field already exists
					return new Response(400, "duplicate", 203); //New code here
				default:
					console.log("ERROR>>" + data + "<<");
					return new Response(500, "unknown", 201); //Default, unknown error
			}
		} else if (err.rowCount === 0){
			return new Response(200, "undefined", null);
		} else {
			console.log("ERROR>>" + data + "<<");
			return new Response(500, "unknown", 201); //Default, unknown error
		}
	}
};
