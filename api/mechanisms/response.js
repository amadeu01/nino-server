/**
* @author Carlos Millani
* @module mechanisms/response
*/

/** @constructor
* @param code
* @param data {JSON}
* @param error {error}
*/
function response(code, data, error) {
	this.code = code;
	this.json = {
		data: data,
		error: error
	};
}

module.exports = response;
