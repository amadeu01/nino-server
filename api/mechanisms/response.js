/**
* @author: Carlos Eduardo Millani
*/

function response(code, data, error) {
	this.code = code;
	this.json = {
		data: data,
		error: error
	};
}
/** @module mechanisms/response */
module.exports = response;
