/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var models = require('../models');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');

suite('School + Classroom Services', function () {

	setup(function (done) {

	    models.waterline.initialize(models.config, function  (err, ontology) {
	        if (err) {
	            return done(err);
	        }
	        done();
	    });
	});

  teardown(function () {
      var adapters = models.config.adapters || {};
      var promises = [];

      Object.keys(adapters)
          .forEach(function (adapter) {
              if (adapters[adapter].teardown) {
                  var promise = new Promise(function (resolve) {
                      adapters[adapter].teardown(null, resolve);
                  });
                  promises.push(promise);
              }
          });

      return Promise.all(promises);
  });

  test('Create School + Classroom + Owner + Educator', function () {
		var schoolServices = require('../services/schools.js');
		var classroomServices = require('../services/classroom.js');
		var parameters = {
			school: {
				name: 'Escola Becke',
				email: 'beckesmail@mail.com',
				cnpj: '14445',
				telephone: '1932124127',
				addr: 'Rua Condessa do Becke, 166'
			},
			owner: {
				name: 'Danilo',
				surname: 'Becke',
				password: 'crescerbrincando',
				email: 'schoolbecke@mail.com',
				cel: '984187636'
			},
      classroom: {
        name: 'Sala do Becke'
      }
		};

		return schoolServices.createWithClassrom(parameters)
    .then(function(result) {
			assert.equal(!isNaN(result.school) & !isNaN(result.educator) & !isNaN(result.classroom), true, 'ID returned is Number');
			return schoolServices.readComplete({id: result.school})
      .then(function(school) {
				console.log("********School********");
				console.log(school);
				return classroomServices.readComplete({id: result.classroom})
				.then(function(classroom){
					console.log("**********Classroom***********");
					console.log(classroom);
				});
      });
    }).catch(function(error) {
      console.log(error);
      throw error;
    });
  });

	test('Create student to classroom', function() {
		var classroomServices = require('../services/schools.js');
		var studentsServices = require('../services/schools.js');
		//Retrieve a Classroom
		return classroomServices.read({id: 1})
		.then(function(classroom) {

		});

	});
	test('Create guardian to student', function(){

	});

});
