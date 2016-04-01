/**
* Carlos Millani
* Module services
*/

var models = require('../models');

var Users = models.waterline.collections.user;
var Educators = models.waterline.collections.educator;
var Roles = models.waterline.collections.role;
var Devices = models.waterline.collections.device;
var Credentials = models.waterline.collections.credential;
var Schools = models.waterline.collections.school;

var validator = require('validator');
var jwt = require('jsonwebtoken');
var permissions = require('../permissions');

var jwtSecret = 'neveperocoftwvamoninow';

var credentialServices = {
	create: function(device, tokenData) {
		var token = jwt.sign(tokenData, jwtSecret, {
      expiresIn: 1440 // expires in 24 hours
    });
		return Credentials.create({device: device.id, token: token, active: true});
	},
	delete: function(token) {
		return Credentials.findOne({token: token})
		.then(function(cred) {
			if (!cred) throw 'Error';
			cred.active = false;
			return cred.save();
		});
	},
	update: function(token) {
		return Credentials.findOne({token: token})
		.then(function(cred) {
			if (!cred) throw 'Error';
			if (!cred.active) throw 'Error';
			return new Promise(function (resolve, reject) {
		    jwt.verify(token, jwtSecret, function(err, decoded) {
		      if (err) {
						reject(err);
		      } else {
						delete decoded.iat;
						delete decoded.exp;
						var newToken = jwt.sign(decoded, jwtSecret, {
				      expiresIn: 1450 // expires in 24 hours
				    });
						cred.token = newToken;
						return cred.save()
						.then(function() {
							resolve(cred);
						})
						.catch(function(err) {
							reject(err);
						});
		      }
		    });
			});
		});
	},
	read: function(token) {
		return Credentials.findOne({token: token})
		.then(function(cred) {
			if (!cred) return undefined;
			if (!cred.active) throw 'Error';
      return new Promise(function (resolve, reject) {
		    jwt.verify(token, jwtSecret, function(err, decoded) {
		      if (err) {
						reject(err);
		      } else {
						resolve(decoded);
		      }
		    });
      });
		});
	}
};

module.exports = credentialServices;
