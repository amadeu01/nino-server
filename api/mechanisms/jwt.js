/**
* @author Carlos Millani
* @module mechanisms/jwt
*/

var jwt = require('jsonwebtoken');
var responses = require('./responses.js');
var jwtSecret = 'neveperocoftwvamoninow'; //TODO: generate SHA key

module.exports = {
	/**
	* @description Create <tt>Token</tt> when a user logs in.
	* @param tokenData {JSON} client?
	* @return promise {Promise} Returns promise with token
	*/
	create: function(tokenData) {
		var token = jwt.sign(tokenData, jwtSecret, {
      expiresIn: 14400 // expires in 24 hours
    });
		return new Promise(function(resolve, reject) {resolve(token);});
	},
	/**
	* @description Renew <tt>Token</tt> when is needed
	* @param token {string}
	* @return promise {Promise} returns promise with <tt>newToken</tt>
	*/
	renew: function(token) {
		return new Promise(function (resolve, reject) {
	    jwt.verify(token, jwtSecret, function(err, decoded) {
	      if (err) {
					reject(responses.invalidCredential(JSON.stringify(err)));
	      } else {
					delete decoded.iat;
					delete decoded.exp;
					var newToken = jwt.sign(decoded, jwtSecret, {
			      expiresIn: 14400 // expires in 24 hours
			    });
					resolve(newToken);
	      }
	    });
		});
	},
	/**
	* @description Validate the client
	* @param token {string}
	* @param client
	* @return promise {Promise} promise with decoded client
	*/
	validate: function(token, client) {
	  return new Promise(function (resolve, reject) {
	    jwt.verify(token, jwtSecret, function(err, decoded) {
	      if (err) {
					reject(err);
	      } else {
					resolve(decoded);
	      }
	    });
	  });
	}
};
