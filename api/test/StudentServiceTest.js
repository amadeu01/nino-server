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


  test('Create Student', function () {
		var Service = require('../services/students.js');
		var parameters = {
			student: {
				name: 'Caduzin',
				surname: 'Millani',
				birthdate: 10112015,
				gender: 'male'
			},
      classroom: 1,
			schoolID: 1
		};
		var parameters2 = {
      student: {
				name: 'Camis',
				surname: 'Pansonato',
				birthdate: 11112015,
				gender: 'female'
			},
      classroom: 1,
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
			assert.strictEqual(record.birthdate, 10112015, 'Data not coherent - birthdate');
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
      assert.strictEqual(newRecord.birthdate, 11112015, 'Data not coherent - birthdate');
			assert.strictEqual(newRecord.gender, 'female', 'Data not coherent - gender');
      return;
		})
		.catch(function(error) {
			console.log(error);
			throw error;
		});
  });

	test('Retrieve all School Educators', function () {

	});

	test('Update Student', function () {
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
