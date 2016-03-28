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
      var Service = require('../services/guardian.js');
      var parameters = {
        name: 'Julia',
  			surname: 'Roberts',
  			password: 'password',
  			email: 'juroberts@emailcom',
  			cel: '1 9999990000',
  			confirmed: true,
        privileges: 1
      };
      return Service.create(parameters);
    });

    test('simulate a error for reaching 2 users while trying update a guardian', function() {
      var Service = require('../services/guardian.js');
      var parametersCreate = {
        name: 'Julia',
  			surname: 'Roberts da Silva',
  			password: 'passwordMaria',
  			email: 'mariaroberts@emailcom',
  			cel: '1 9999990000',
  			confirmed: true,
        privileges: 1
      };
      var parameters = {
  			name: 'Julia'
      };
      var newParameters = {
        password: 'new_password'
      };
      return Service.create(parametersCreate).then(function(){
        return Service.update(parameters, newParameters).then(function(user){
          console.log(user);
        }).catch(function(err){
          console.log(err);
        });
      });
    });

    test('should be able to update data from a guardian', function() {
      var Service = require('../services/guardian.js');
      var parameters = {
  			email: 'juroberts@emailcom',
        password: 'password'
      };
      var newParameters = {
        password: 'new_password'
      };

      return Service.update(parameters, newParameters).then(function(user){
        console.log(user);
      }).catch(function(err){
        console.log("Error for update guardian!");
        console.log(err);
      });
    });

    test('should be able to read a guardian', function() {
      var Service = require('../services/guardian.js');
      var parameters = {
        name: 'Julia',
  			surname: 'Roberts',
  			email: 'juroberts@emailcom'
      };
      return Service.read(parameters).then(function(users){
        return console.log(users);
      }).catch(function(err) {
        console.log(err);
        return;
      })
    });

    test('should delete a guardian', function(){
      var Service = require('../services/guardian.js');
      var parameters = {
        name: 'Julia'
      };
      return Service.delete(parameters);
    });



});
