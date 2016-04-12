/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var models = require('../models');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');

suite('User Services', function () {

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

  //Create
  test('should create User', function () {
		var Services = require('../services/user.js');
		var parameters = {
			user: {
				name: 'Pedro',
				surname: 'Cesar',
				password: 'password',
				email: 'pedrocs@mail.com',
				cel: '984187636'
			}
		};
		var parameters2 = {
			user: {
				name: 'Francisco',
				surname: 'Amarante',
				password: 'password',
				email: 'amaranteu@mail.com',
				cel: '984187636'
			}
		};
		return Services.create(parameters)
		.then(function(result) {
			assert.equal(!isNaN(result.user), true, 'ID returned is Number');
			return Services.read({id: result.user});
		})
		.then(function(record) {
			assert.strictEqual(record.name, 'Pedro', 'Data not coherent - name');
			assert.strictEqual(record.surname, 'Cesar', 'Data not coherent - surname');
			assert.strictEqual(record.password, 'password', 'Data not coherent - password');
			assert.strictEqual(record.email, 'pedrocs@mail.com', 'Data not coherent - email');
			assert.strictEqual(record.cel, '984187636', 'Data not coherent - cel');
			return;
		})
		.then(function() {
			return Services.create(parameters2);
		})
		.then(function(newResult) {
			return Services.read({id: newResult.user});
		})
		.then(function(newRecord) {
			assert.strictEqual(newRecord.name, 'Francisco', 'Data not coherent - name');
			assert.strictEqual(newRecord.surname, 'Amarante', 'Data not coherent - surname');
			assert.strictEqual(newRecord.password, 'password', 'Data not coherent - password');
			assert.strictEqual(newRecord.email, 'amaranteu@mail.com', 'Data not coherent - email');
			assert.strictEqual(newRecord.cel, '984187636', 'Data not coherent - cel');
		})
		.catch(function(error) {
			console.log(error);
			throw error;
		});
  });

	test('should update User', function () {
		var Services = require('../services/user.js');
		return Services.update({id: 5}, {surname: 'Menotti'})
		.then(function(updated) {
			return Services.read({id: 5});
		})
		.then(function(read) {
			assert.strictEqual(read.surname, 'Menotti', 'Updated incorrectly');
		})
		.catch(function(error) {
			console.log(error);
			throw error;
		});

	});

	test('should delete User', function () {
		var Services = require('../services/user.js');
		return Services.delete({id: 5})
		.then(function(user) {
			return Services.read({id: 5});
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
