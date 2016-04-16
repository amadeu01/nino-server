/**
* Amadeu Cavalcante
* Module services
*/

var assert = require('assert');
var models = require('../models');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');

suite('Student Services', function () {

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

  test('Create School + Owner AND check read values', function () {
		var school = require('../services/schools.js');
		var parameters = {
			school: {
				name: 'Escola Amadeu',
				email: 'emailEscola@mail.com',
				cnpj: '123135',
				telephone: '32124327',
				addr: 'Rua Condessa do Pinhal, 542'
			},
			owner: {
				name: 'Amadeu',
				surname: 'Cavalcante',
				password: 'password',
				email: 'amadeuEscola@mail.com',
				cel: '984187636'
			}
		};
		return school.create(parameters)
		.then(function(result) {
			assert.equal(!isNaN(result.school) & !isNaN(result.educator), true, 'ID returned is Number');
			return school.read({id: result.school});
		})
		.then(function(record) {
			assert.strictEqual(record.name, 'Escola Amadeu', 'Data not coherent - name');
			assert.strictEqual(record.email, 'emailEscola@mail.com', 'Data not coherent - email');
			assert.strictEqual(record.cnpj, '123135', 'Data not coherent - cnpj');
			assert.strictEqual(record.telephone, '32124327', 'Data not coherent - telephone');
			assert.strictEqual(record.addr, 'Rua Condessa do Pinhal, 542', 'Data not coherent - addr');
		})
		.catch(function(error) {
			console.log(error);
			throw error;
		});
  });

  test ('Create classroom for students', function() {
		var classroomServices = require('../services/classroom.js');
		var parameters = {
			classroom: {
				name: "Sala Para Novos estudantes"
			},
			school: 1
		};
		return classroomServices.create(parameters)
		.then(function(result){
			return classroomServices.readComplete({id: result.classroom})
			.then(function(classroom){
				//console.log(classroom);
				return;
			});
		});
  });

  test('Create Student', function () {
		var Service = require('../services/students.js');
		var parameters = {
			student: {
				name: 'Caduzin',
				surname: 'Millani',
				birthdate: new Date(2015, 0, 0),
				gender: 'male'
			},
      classroomID: 1,
			schoolID: 1
		};
		var parameters2 = {
      student: {
				name: 'Camis',
				surname: 'Pansonato',
				birthdate: new Date(2015, 1, 0),
				gender: 'female'
			},
      classroomID: 1,
			schoolID: 1
		};
		return Service.create(parameters)
		.then(function(result) {
			assert.equal(!isNaN(result.student), true, 'ID returned is Number');
			return Service.read({id: result.student});
		})
		.then(function(record) {
			assert.strictEqual(record.name, 'Caduzin', 'Data not coherent - name');
			assert.strictEqual(record.surname, 'Millani', 'Data not coherent - surname');
			assert.strictEqual(record.gender, 'male', 'Data not coherent - gender');
			return;
		})
		.then(function() {
			return Service.create(parameters2);
		})
		.then(function(newResult) {
			return Service.read({id: newResult.student});
		})
		.then(function(newRecord) {
			assert.strictEqual(newRecord.name, 'Camis', 'Data not coherent - name');
			assert.strictEqual(newRecord.surname, 'Pansonato', 'Data not coherent - surname');
			assert.strictEqual(newRecord.gender, 'female', 'Data not coherent - gender');
      return;
		})
		.catch(function(error) {
			console.log(error);
			throw error;
		});
  });

	test('Retrieve all Students of classroom', function () {
		var classroomServices = require('../services/classroom.js');
		return classroomServices.readAllStudents({id: 1})
		.then(function(students){
			//console.log(students);
			return;
		});
	});
	test('Add a guardian', function() {
		var guardianService = require('../services/guardian.js');
		var studentsServices = require('../services/students.js');
		var parameters = {
			user: {
				name: 'Marcia',
				surname: 'Cavalcante',
				password: 'password',
				email: 'marciacavalcante@nino.com.br',
				cel: '1 9999990000',
				confirmed: true
			},
			privileges: 1
		};
		return guardianService.create(parameters).
		then(function(result){
			return studentsServices.addGuardian({id: 1}, {id: 2})
			.then(function() {
				return studentsServices.readComplete({id: 1})
				.then(function(student){
					// console.log("Student id: 1");
					// console.log(student);
					// console.log("##############################");
					return;
				});
			});
		});
	});
	test('Update Student', function () {
	});

	test('Read Student', function() {
		var studentService = require('../services/students.js');
		return studentService.readComplete({id: 2})
		.then(function(student){
			// console.log("Student id: 2");
			// console.log(student);
			// console.log("#####################");
			return;
		});
	});

	test('Delete Student', function () {
    var Service = require('../services/students.js');
    return Service.delete({id: 1})
    .then(function() {
      return Service.read({id: 1});
    })
    .then(function(deleted) {
      assert.strictEqual(deleted, undefined, 'Should be inactive');
      return;
    })
    .catch(function(error) {
      console.log('Error: '+error);
      throw error;
    });
	});

});
