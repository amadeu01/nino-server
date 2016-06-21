/**
* @author Carlos Millani
* @module mechanisms
*/

function response(code, data, error) {
	this.code = code;
	this.json = {
		data: data,
		error: error
	};
}

module.exports = response;
