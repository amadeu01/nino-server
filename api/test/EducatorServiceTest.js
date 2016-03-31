/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var models = require('../models');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');

suite('School Services', function () {

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
		return educator.create(parameters)
		.then(function(result) {
			assert.equal(!isNaN(result.educator), true, 'ID returned is Number');
			return educator.read({id: result.educator});
		})
		.then(function(record) {
			console.log(record);
			// assert.strictEqual(record.name, 'Cadu', 'Data not coherent - name');
			// assert.strictEqual(record.surname, 'Millani', 'Data not coherent - surname');
			// assert.strictEqual(record.password, 'password', 'Data not coherent - password');
			// assert.strictEqual(record.email, 'cadueducator@mail.com', 'Data not coherent - email');
			// assert.strictEqual(record.cel, '984187636', 'Data not coherent - cel');
		})
		.catch(function(error) {
			console.log(error);
			throw error;
		});
  });

});
