/**
* Amadeu Cavalcante
* Module services
*/

var models = require('../models');
var services = require ('../services');

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
