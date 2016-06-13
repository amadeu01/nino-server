/**
* Author: Carlos Eduardo Millani
* JWT
*/

var jwt = require('jsonwebtoken');
var errors = require('./error');

var jwtSecret = 'neveperocoftwvamoninow'; //TODO: generate SHA key


module.exports = {
	create: function(tokenData) {
		var token = jwt.sign(tokenData, jwtSecret, {
      expiresIn: 1440 // expires in 24 hours
    });
		return new Promise(function(resolve, reject) {resolve(token);});
	},
	renew: function(token) {
		return new Promise(function (resolve, reject) {
	    jwt.verify(token, jwtSecret, function(err, decoded) {
	      if (err) {
					reject(errors.invalidCredential(JSON.stringify(err)));
	      } else {
					delete decoded.iat;
					delete decoded.exp;
					var newToken = jwt.sign(decoded, jwtSecret, {
			      expiresIn: 1440 // expires in 24 hours
			    });
					resolve(newToken);
	      }
	    });
		});
	},
	validate: function(token, client) {
	  return new Promise(function (resolve, reject) {
	    jwt.verify(token, jwtSecret, function(err, decoded) {
	      if (err) {
					reject(errors.invalidCredential(JSON.stringify(err)));
	      } else {
					resolve(decoded);
	      }
	    });
	  });
	}
};
