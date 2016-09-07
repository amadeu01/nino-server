/**
* @author Carlos Millani
* @module mechanisms/jwt
*/

var fs = require('fs');
var jwt = require('jsonwebtoken');
var responses = require('./responses.js');

var privateKey = fs.readFileSync(__dirname + '/jwt.key');
var publicKey = fs.readFileSync(__dirname + '/jwt.key.pub.pem');

var signOptions = {
	expiresIn: 3600, //1 hour
	algorithm: 'RS256'
}

var verifyOptions = {
	clockTolerance: 300,
	algorithms: ['RS256']
}

module.exports = {
	/**
	* @description Create <tt>Token</tt> when a user logs in.
	* @param tokenData {JSON} client?
	* @return promise {Promise} Returns promise with token
	*/
	create: function(tokenData) {
		var token = jwt.sign(tokenData, privateKey, signOptions);
		return new Promise(function(resolve, reject) {resolve(token);});
	},
	/**
	* @description Renew <tt>Token</tt> when is needed
	* @param token {string}
	* @return promise {Promise} returns promise with <tt>newToken</tt>
	*/
	renew: function(token) {
		return new Promise(function (resolve, reject) {
	    jwt.verify(token, publicKey, verifyOptions, function(err, decoded) {
	      if (err) {
					reject(responses.invalidCredential(err));
	      } else {
					delete decoded.iat;
					delete decoded.exp;
					var newToken = jwt.sign(decoded, privateKey, signOptions);
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
	    jwt.verify(token, publicKey, verifyOptions, function(err, decoded) {
	      if (err) {
			console.log(err);
					reject(err);
	      } else {
					resolve(decoded);
	      }
	    });
	  });
	}
};
