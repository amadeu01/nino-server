/**
* Carlos Millani
* Module services
*/

var models = require('../models');
var Users = models.waterline.collections.user;
var Educators = models.waterline.collections.educator;
var Roles = models.waterline.collections.role;
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
		return Roles.findOne(parameters);
	}
};

module.exports = schoolServices;
