/**
* Author: Carlos Eduardo Millani
* Responses
*/

function response(code, data, error) {
	this.code = code;
	this.json = {
		data: data,
		error: error
	};
}

module.exports = response;