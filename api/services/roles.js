/**
* Carlos Millani
* Module services
*/

var models = require('../models');

var errors = require('../services/errors');

var validator = require('validator');

var permissions = require('../services/permissions');

var schoolServices = {
	create: function(parameters) {

	},
	delete: function(parameters) {
		
	},
	update: function(parameters, newParatemers) {
		
	},
	read: function(parameters) {
		// return Roles.find()
		return models.waterline.collections.role.findOne(parameters);
	}
};

module.exports = schoolServices;
