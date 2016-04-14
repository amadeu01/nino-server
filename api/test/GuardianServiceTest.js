/**
Author: Amadeu Cavalcante
Model for testing, using mocha.
*/

var assert = require('assert');
var models = require('../models');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');

suite('Guardians Services', function () {

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
    test('should create a guardian', function() {
      var Service = require('../services/guardian.js');
      var parameters = {
        user: {
          name: 'Julia',
  			  surname: 'Roberts',
  			  password: 'password',
  			  email: 'juroberts@nino.com',
  			  cel: '1 9999990000',
  			  confirmed: true
        },
        privileges: 1
      };
      return Service.create(parameters);
    });

    //Update
    test('should update a guardian', function () {
  		var Service = require('../services/guardian.js');
  		return Service.update({id: 1}, {}, {privileges: 444})
  		.then(function(updated) {
  			return Service.read({id: 1});
  		})
  		.then(function(read) {
  			assert.strictEqual(read.privileges, 444, 'Updated permissions incorrect');
  		})
  		.catch(function(error) {
  			console.log(error);
  			throw error;
  		});

  	});

    //Delete
    test('should delete a guardian', function(){
      var Service = require('../services/guardian.js');
  		return Service.delete({id: 1})
  		.then(function(guardian) {
  			return Service.read({id: 1});
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
