/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var models = require('../models');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');

suite('JWT Business', function () {

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
  
	var token;
	
	test('services Create Credential', function () {
		var services = require('../services');
		return services.jwt.create({info: 'OlaMarilene'})
		.then(function(cred) {
			token = cred;
			return services.jwt.validate(cred);
		})
		.then(function(decoded) {
			assert.strictEqual(decoded.info, 'OlaMarilene', 'Incorrect token data');
		});
  });
	
	test('services Renew Credential', function () {
		var services = require('../services');
		return services.jwt.renew(token)
		.then(function(renewed) {
			return services.jwt.validate(renewed);
		})
		.then(function(decoded) {
			assert.strictEqual(decoded.info, 'OlaMarilene', 'Incorrect token data');
		});
  });
	
});
