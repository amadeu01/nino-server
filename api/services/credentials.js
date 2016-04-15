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

var credentialServices = {
	create: function(device, token, owner) {
		return Devices.findOrCreate({description:device}, {description:device, owner: owner})
		.then(function(device) {
			device.credentials.add({token: token, active: true});
			return device.save();
		});
	},
	delete: function(token) {
		return Credentials.destroy({token: token});
	},
	update: function(token, newToken) {
		return Credentials.update({token: token}, {token: newToken});
	},
	read: function(token) {
		return Credentials.findOne({token: token}).populate('device');
	}
};

module.exports = credentialServices;
