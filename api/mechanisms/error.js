/**
* @author: Carlos Eduardo Millani
* @module mechanisms/errors
*/

var response = require('./response.js');

module.exports = {
	//Register related errors
	/**@method */
	inexistentRegister: function(data) {
		return new response(404, data, 100);
	},
	/**@method */
	deletedRegister: function(data) {
		return new response(404, data, 101);
	},

	//Server related errors
	/**@method */
	invalidParameters: function(data) {
		return new response( 400, data, 200);
	},
	/**@method */
	internalError: function(data) {
		return new response( 500, data, 201);
	},
	/**@method */
	missingParameters: function(data) {
		return new response( 400, data, 202);
	},

	//Token related errors
	/**@method */
	invalidPermissions: function(data) {
		return new response( 403, data, 300);
	},
	/**@method */
	invalidCredential: function(data) {
		return new response( 403, data, 301);
	},
	/**@method */
	expiredCredential: function(data) {
		return new response( 403, data, 302);
	},
	/**@method
	 * @description trigged when a Bot try to send a request
	 */
	isBot: function(data) {
		return new response( 403, data, 303);
	},

	/** @method
	*/
	persistenceError: function(err) {
		if (err.name == 'error') {
			switch (err.code) {
				case 23502:
					return new response(400, {detail:err.detail}, 202);
				case 23505:
					return new response(400, {detail:err.detail}, 203); //New code here
				default:
					return new response(500, {detail:err.detail}, 201); //Default, unknown error
			}
		} else if (err.rowCount === 0){
			return new response(404, {}, 100);
		} else {
			return new response(500, {detail:err.detail}, 201); //Default, unknown error
		}
	}
};
