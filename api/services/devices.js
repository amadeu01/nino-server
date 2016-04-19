/**
* Amadeu Cavalcante
* Module services
*/

var models = require('../models');

//errors and validator's module
var errors = require('../services/errors');
var validator = require('validator');

var deviceServices = {
	create: function() {

	},
	delete: function() {

	},
	update: function() {

	},
	read: function(parameters) {
		return models.waterline.collections.device.find(parameters).populate('credentials');
	}
};

module.exports = deviceServices;
