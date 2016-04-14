var jwt = require('jsonwebtoken');
var permissions = require('./permissions');
var errors = require('./errors');

var jwtSecret = 'neveperocoftwvamoninow';

var services = require('../services');

module.exports = {
	validateIdentity: function(user_id, target) {
		services.devices.read({owner: user_id})
		.then(function() {
			
		});
	},
	create: function(tokenData) {
		var token = jwt.sign(tokenData, jwtSecret, {
      expiresIn: 1440 // expires in 24 hours
    });
	},
	renew: function(token, client) {
		return services.credentials.read(token)
		.then(function(credential) {
			if (credential.device.description != client) {
				throw errors.invalidCredential('Wrong device');
			} else {
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
							credential.token = newToken;
							return credential.save()
							.then(function() {
								resolve(credential);
							})
							.catch(function(err) {
								reject(errors.internalError(JSON.stringify(err)));
							});
			      }
			    });
				});
			});
		});
	},
	invalidate: function(token, caller) {
		this.validateIdentity(caller.id, token)
		.then(function () {
			
		})
		.catch(function() {
			
		});
	},
	validate: function(token, client) {
		return services.credentials.read(token)
		.then(function(credential) {
	    return new Promise(function (resolve, reject) {
				if (credential.device.description != client) {
					reject(errors.invalidCredential('Wrong device'));
				} else {
			    jwt.verify(token, jwtSecret, function(err, decoded) {
			      if (err) {
							reject(errors.invalidCredential(JSON.stringify(err)));
			      } else {
							resolve(decoded);
			      }
			    });
				}
	    });
		});
	}
	
}