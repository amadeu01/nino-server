var jwt = require('jsonwebtoken');
var permissions = require('./permissions');
var errors = require('./errors');

var jwtSecret = 'neveperocoftwvamoninow';

var services = require('../services');

module.exports = {
	create: function(tokenData) {
		var token = jwt.sign(tokenData, jwtSecret, {
      expiresIn: 1440 // expires in 24 hours
    });
		return new Promise(function(resolve, reject) {resolve(token)});
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
}