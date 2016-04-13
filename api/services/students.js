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

var studentsServices = {
	create: function(params, done) {
		models.student.create(params, function(err, baby) {
			done(err, student);
		});
	},
	delete: function() {

	},
	update: function(params, done) {
		models.student.update({id: params.id}, function(err, student) {
			done(err, student);
		});
	},
  read: function() {

  }

};

module.exports = studentsServices;
