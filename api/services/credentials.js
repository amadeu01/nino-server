/**
* Carlos Millani
* Module services
*/

var models = require('../models');

var credentialServices = {
	create: function(device, token, owner) {
		return models.waterline.collections.device.findOrCreate({description:device}, {description:device, owner: owner})
		.then(function(device) {
			device.credentials.add({token: token, active: true});
			return device.save();
		});
	},
	delete: function(token) {
		return models.waterline.collections.credential.destroy({token: token});
	},
	update: function(token, newToken) {
		return models.waterline.collections.credential.update({token: token}, {token: newToken});
	},
	read: function(token) {
		return models.waterline.collections.credential.findOne({token: token}).populate('device');
	}
};

module.exports = credentialServices;
