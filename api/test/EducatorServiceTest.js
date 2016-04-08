/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var models = require('../models');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');

suite('Educator Services', function () {

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

  test('Create Educators', function () {
		var educator = require('../services/educators');
		var parameters = {
			user: {
				name: 'Cadu',
				surname: 'Millani',
				password: 'password',
				email: 'cadueducator@mail.com',
				cel: '984187636'
			},
			privileges: 123,
			schoolID: 1
		};
		var parameters2 = {
			user: {
				name: 'Amadeu',
				surname: 'Cavalcante',
				password: 'password',
				email: 'amadeu@mail.com',
				cel: '984187636'
			},
			privileges: 123,
			schoolID: 1
		};
		return educator.create(parameters)
		.then(function(result) {
			assert.equal(!isNaN(result.educator), true, 'ID returned is Number');
			return educator.read({id: result.educator});
		})
		.then(function(record) {
			assert.strictEqual(record.owner.name, 'Cadu', 'Data not coherent - name');
			assert.strictEqual(record.owner.surname, 'Millani', 'Data not coherent - surname');
			assert.strictEqual(record.owner.password, 'password', 'Data not coherent - password');
			assert.strictEqual(record.owner.email, 'cadueducator@mail.com', 'Data not coherent - email');
			assert.strictEqual(record.owner.cel, '984187636', 'Data not coherent - cel');
			assert.strictEqual(record.privileges, 123, 'Data not coherent - privileges');
			assert.strictEqual(record.type, 'educator', 'Data not coherent - type');
			return;
		})
		.then(function() {
			return educator.create(parameters2);
		})
		.then(function(newResult) {
			return educator.read({id: newResult.educator});
		})
		.then(function(newRecord) {
			assert.strictEqual(newRecord.owner.name, 'Amadeu', 'Data not coherent - name');
			assert.strictEqual(newRecord.owner.surname, 'Cavalcante', 'Data not coherent - surname');
			assert.strictEqual(newRecord.owner.password, 'password', 'Data not coherent - password');
			assert.strictEqual(newRecord.owner.email, 'amadeu@mail.com', 'Data not coherent - email');
			assert.strictEqual(newRecord.owner.cel, '984187636', 'Data not coherent - cel');
			assert.strictEqual(newRecord.privileges, 123, 'Data not coherent - privileges');
			assert.strictEqual(newRecord.type, 'educator', 'Data not coherent - type');
		})
		.catch(function(error) {
			console.log(error);
			throw error;
		});
  });
	
	test('Retrieve all School Educators', function () {
		var educator = require('../services/educators');
		return educator.readAllFromSchool({school: 1})
		.then(function(educators) {
			assert.strictEqual(educators.length, 2, 'Educators Array length incorrect');
		})
		.catch(function(error) {
			console.log(error);
			throw error;
		});
		
	});
	
	test('Update Educator', function () {
		var educator = require('../services/educators');
		return educator.update({id: 1}, {}, {permissions: 444})
		.then(function(updated) {
			return educator.read({id: 1});
		})
		.then(function(read) {
			assert.strictEqual(read.permissions, 444, 'Updated permissions incorrect');
		})
		.catch(function(error) {
			console.log(error);
			throw error;
		});
		
	});

	test('Delete Educator', function () {
		var educator = require('../services/educators');
		return educator.delete({id: 1})
		.then(function(educators) {
			return educator.read({id: 1});
		})
		.then(function(deleted) {
			assert.strictEqual(deleted, undefined, 'Should be inactive');
		})
		.catch(function(error) {
			console.log(error);
			throw error;
		});	
	});

});
