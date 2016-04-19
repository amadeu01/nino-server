/**
* Amadeu Cavalcante
* Module services
*/

var models = require('../models');
var Users = models.waterline.collections.user;
var Roles = models.waterline.collections.role;
var Devices = models.waterline.collections.device;
var Credentials = models.waterline.collections.credential;

//errors and validator's module
var errors = require('../business/errors');
var validator = require('validator');

var deviceServices = {
	create: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return Devices.create({
			arn: parameters.arn,
			description: parameters.description,
			owner: parameters.owner
		}).then(function(device){
			if (!device) throw errors.internalError('Device - Creation Error');
			return ({device: device.id});
		});
	},
	delete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Devices.findOne(parameters)
		.then(function(device){
			if (!device) throw errors.inexistentRegister('Device - Finding Error');
			device.active = false;
			return device.save();
		});
	},
	update: function(parameters, newParatemers) {
		if (!parameters || !newParatemers) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Devices.update(parameters, newParatemers)
		.then(function(devices){
			if (!devices) throw errors.inexistentRegister('Device - Finding Error');
			return devices;
		});
	},
	read: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Devices.findOne(parameters)
		.then(function(device){
			if(!device) return undefined;
			return device;
		});
	},
	readComplete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing parameters');
		parameters.active = true;
		return Devices.findOne(parameters).populate(['credentials', 'owner'])
		.then(function (device){
			if (!device) throw errors.inexistentRegister('Device - Finding Error');
		});
	},
	addCredential: function(parameters, credential_id) {
		if (!parameters || !credential_id) throw errors.invalidParameters('Missing Parameter');
		return Devices.findOne(parameters).populate('credentials')
		.then(function(device){
			if (!device) throw errors.inexistentRegister('Device - Finding Error');
			device.credentials.add(credential_id);
			return device.save();
		});
	}
};

module.exports = deviceServices;
