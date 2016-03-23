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

    test('should create a guardian', function() {
      var service = require('../services/guardian.js');
      service.create({ privileges: 1}, function(err, results) {
        console.log(results);
        console.log(err);
      });
    });
  });
