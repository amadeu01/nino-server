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
		var school = require('../services/schools.js');
		var parameters = {
			school: {
				name: 'Escola Millani',
				email: 'email@mail.com',
				cnpj: '123145',
				telephone: '32124127',
				addr: 'Rua Condessa do Pinhal, 542'
			},
			owner: {
				name: 'Cadu',
				surname: 'Millani',
				password: 'password',
				email: 'cadu@mail.com',
				cel: '984187636'
			}
		};
		return school.create(parameters)
		.then(function(result) {
			assert.equal(!isNaN(result.school) & !isNaN(result.educator), true, 'ID returned isNaN');
			return school.read({id: result.school});
		})
		.then(function(record) {
			assert.strictEqual(record.name, 'Escola Millani', 'Data not coherent - name');
			assert.strictEqual(record.email, 'email@mail.com', 'Data not coherent - email');
			assert.strictEqual(record.cnpj, '123145', 'Data not coherent - cnpj');
			assert.strictEqual(record.telephone, '32124127', 'Data not coherent - telephone');
			assert.strictEqual(record.addr, 'Rua Condessa do Pinhal, 542', 'Data not coherent - addr');
		})
		.catch(function(error) {
			console.log(error);
			throw error;
		});
  });

});
