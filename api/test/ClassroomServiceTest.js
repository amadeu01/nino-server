/**
* Carlos Millani
* Module services
* last modified: Amadeu Cavalcante
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
		//Initial is also owner Educator
		var schoolServices = require('../services/schools.js');
		var classroomServices = require('../services/rooms.js');
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
        name: 'Sala do Becke',
				type: 1
      }
		};

		return schoolServices.createWithClassrom(parameters)
    .then(function(result) {
			assert.equal(!isNaN(result.school) & !isNaN(result.educator) & !isNaN(result.classroom), true, 'ID returned is Number');
			return schoolServices.readComplete({id: result.school})
      .then(function(school) {
				// console.log("********School********");
				// console.log(school);
				return classroomServices.readComplete({id: result.classroom})
				.then(function(classroom){
					// console.log("**********Classroom***********");
					// console.log(classroom);
				});
      });
    }).catch(function(error) {
      console.log(error);
      throw error;
    });
  });

	test('Create student to classroom', function() {
		var classroomServices = require('../services/schools.js');
		var studentsServices = require('../services/students.js');
		//Student
		var parameters = {
			student: {
				name: 'Alfredinho',
				surname: 'Cavalcante',
				birthdate: new Date(2015, 2, 0),
				gender: 'male'
			},
      classroomID: 1,
			schoolID: 1
		};
		//Retrieve a Classroom
		return studentsServices.create(parameters)
		.then(function(student) {
			return;
		});

	});
	test('Add educator', function() {
		var classroomServices = require('../services/rooms.js');
		var educatorServices = require('../services/educators.js');
		var educatorParameters = {
			user: {
				name: 'Raimunda Marcia',
				surname: 'Cavalcante',
				password: 'password',
				email: 'cida@cidamail.com',
				cel: '984187636'
			},
			privileges: 123,
			schoolID: 1,
			classroomID: 1
		};

		return educatorServices.create(educatorParameters)
		.then(function(result) {
			assert.equal(!isNaN(result.educator), true, 'ID returned is Number');
			return educatorServices.read({id: result.educator});
		})
		.then(function(record) {
			console.log(record.owner.id);
			assert.strictEqual(record.owner.name, 'Raimunda Marcia', 'Data not coherent - name');
			assert.strictEqual(record.owner.surname, 'Cavalcante', 'Data not coherent - surname');
			assert.strictEqual(record.owner.password, 'password', 'Data not coherent - password');
			assert.strictEqual(record.owner.email, 'cida@cidamail.com', 'Data not coherent - email');
			return;
		});
	});
	test('Create guardian to student', function(){

	});

});
