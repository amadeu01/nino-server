/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var models = require('../models');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');

suite('Credential Services', function () {

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
	
	test('Business Create Credential', function () {
		var business = require('../business');
		return business.jwt.create({info: 'OlaMarilene'})
		.then(function(cred) {
			token = cred;
			return business.jwt.validate(cred);
		})
		.then(function(decoded) {
			assert.strictEqual(decoded.info, 'OlaMarilene', 'Incorrect token data');
		});
  });
	
	test('Business Renew Credential', function () {
		var business = require('../business');
		return business.jwt.renew(token)
		.then(function(renewed) {
			return business.jwt.validate(renewed);
		})
		.then(function(decoded) {
			assert.strictEqual(decoded.info, 'OlaMarilene', 'Incorrect token data');
		});
  });
	
});
