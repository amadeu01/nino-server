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

	var createdToken;
	var originalExp;
  test('Create Credential', function () {
		var credential= require('../services/credentials.js');
		var info = {Info: 'MySafeCredential'};
		return credential.create({id:1}, info)
		.then(function(cred) {
			createdToken = cred.token;
			return credential.read(cred.token);
		})
		.then(function(verified) {
			originalExp = verified.exp;
			delete verified.iat;
			delete verified.exp;
			assert.strictEqual(verified.info, info.info, 'Values not equal');
		});
  });
	
  test('Update and verify', function () {
		var credential= require('../services/credentials.js');
		return credential.update(createdToken)
		.then(function(cred) {
			createdToken = cred.token;
			return credential.read(cred.token);
		})
		.then(function(verified) {
			assert.notStrictEqual(verified.exp, originalExp, 'Values not equal');
		});
  });
	
  test('Delete and verify', function () {
		var credential= require('../services/credentials.js');
		return credential.delete(createdToken)
		.then(function() {
			return credential.read(createdToken);
		})
		.catch(function(err) {
			assert.strictEqual(err, 'Error', 'Should have failed security');
		});
  });
	
});
