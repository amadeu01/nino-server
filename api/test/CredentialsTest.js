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
	var info = 'MySafeCredential';
  test('Create Credential', function () {
		var credential= require('../services/credentials.js');
		return credential.create({id:1}, info)
		.then(function(cred) {
			return credential.read(cred.token);
		})
		.then(function(verified) {
			assert.strictEqual(verified.token, info, 'Values not equal');
		});
  });
	
  test('Update and verify', function () {
		var credential= require('../services/credentials.js');
		return credential.update(info, info + '2')
		.then(function(cred) {
			return credential.read(info + '2');
		})
		.then(function(verified) {
			assert.notStrictEqual(verified, info + '2', 'Values not equal');
		});
  });
	
  test('Delete and verify', function () {
		var credential= require('../services/credentials.js');
		return credential.delete(info + '2')
		.then(function() {
			return credential.read(info + '2');
		})
		.catch(function(err) {
			assert.strictEqual(err, 'Error', 'Should have failed security');
		});
  });
	
});
