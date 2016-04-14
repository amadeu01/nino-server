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
	create: function(device, token) {
		return Credentials.create({device: device.id, token: token, active: true});
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
