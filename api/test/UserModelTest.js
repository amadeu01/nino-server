/**
Author: Amadeu Cavalcante
Model for testing, using mocha.
*/

var assert = require('assert');
var Waterline = require('waterline');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');

suite('User', function () {
    var waterline = new Waterline();
    var config = {
        adapters: {
            'sails-memory': sailsMemoryAdapter,
            disk: myDiskAdapter
        },
        connections: {
            default: {
                adapter: 'disk'
            },
            memory: {
              adapter: 'sails-memory'
            }
        }
    };

    setup(function (done) {
      // waterline.loadCollection(require('./models/Index.js'));
        waterline.loadCollection(require('../models/Users.js'));
        waterline.loadCollection(require('../models/Roles.js'));
        waterline.loadCollection(require('../models/Devices.js'));
        waterline.loadCollection(require('../models/Credentials.js'));

        waterline.initialize(config, function  (err, ontology) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    teardown(function () {
        var adapters = config.adapters || {};
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

    test('should be able to create a user', function () {
        var User = waterline.collections.user;
        var Device = waterline.collections.device;
        var Credential = waterline.collections.credential;
        var Roles = waterline.collections.role;

        return User.create({
          name: 'Neil',
          surname: 'Armstrong',
          username: 'neil',
          password: 'password',
          email: 'neil@ninoapp.com.br',
          cel: '5519 9 9999 9999',
          confirmed: true
        }).then(function (user) {
          return Roles.create({
            privileges: '1',
            user: user.id,
            role_type: 'guardian'
          }).then(function(role){
            user.role = [role];
            return Device.create({
                arn: 'asfnancabprwuei1924830149324',
                description: 'Here some description',
                enable: true,
                user: user.id,
              }).then(function(device) {
                user.device = [device];
                return Credential.create({
                    user: user.id,
                    devices: device.id
                  }).then(function(credential){
                    user.credential = [credential];
                    role.save();
                    device.save();
                    credential.save();
                    return user.save();
                  });
                });
              });
            });
          });

    test('should be able to retrieve a user', function() {
      var User = waterline.collections.user;
      return User.find().exec(function(err, users){
        console.log("User find");
        if (err) {
          console.log("error!");
          return console.log(err.stack);
        } else {
          console.log('length: %d', users.length);
          var userTest = users.pop();
          return console.log("Nome %j", userTest.toJSON());
        }
      });
    });
    //TODO: if create a new User, also generate all data needed to it
    test('Find or create user', function(){
      var User = waterline.collections.user;
      var Device = waterline.collections.device;
      var Credential = waterline.collections.credential;
      var Roles = waterline.collections.role;

      return User.findOrCreate({
        name: 'João',
        surname: 'Cavalcante',
        email: 'jao@ninoapp.com.br',
        password: 'password',
        username: 'joa',
        cel: '55 9 9919 9919',
        confirmed: true
      }).then(function (users) {
        if (users.constructor === Array) {
          console.log("users length: %d", users.length);
          console.log("users: %j", users.toJSON());
          var user = users.pop();
          console.log("user: %j", user.toJSON());
        } else{
          var user = users;
          console.log("user: %j", user.toJSON());
       }
      });
    });

    // TODO: delete all data related to User
    test('should delete user', function() {
      var User = waterline.collections.user;

      return User.destroy({name: 'Neil'}).then( function(err){
          return console.log(err.stack);
      });
    });

});
