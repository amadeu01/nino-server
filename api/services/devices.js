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
	create: function() {

	},
	delete: function() {

	},
	update: function() {

	},
	read: function() {

	}
};

module.exports = deviceServices;
