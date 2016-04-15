/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var models = require('../models');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');

suite('School Business Services', function () {

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
	
  test('Create School', function () {
		var business = require('../business');
		return business.schools.create({
			owner: {
				name: 'Rodrigo',
				surname: 'Silva',
				password: 'senha',
				email: 'email@email.com',
				cel: '1928384'
			},
			school: {
				name: 'Escolinha',
				email: 'escolinha@escolinha.com',
				cnpj: '123145',
				telephone: '32124127',
				addr: 'Rua Condessa do Pinhal, 542'
			},
			device: 'iPhone6 Safari'
		})
		.then(function(school) {
			// console.log('ALOU'+school);
		})
		.catch(function(err) {
			// console.log('Errou'+err);
		});
  });
	
});
