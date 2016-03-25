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
          password: 'password',
          email: 'neil@ninoapp.com.br',
          cel: '5519 9 9999 9999',
          confirmed: true
        }).then(function (user) {
            return Roles.create({
              privileges: 1,
              owner: user.id,
              type: "guardian"
            }).then(function(role){
              user.roles = [role];
              return Device.create({
                  arn: 'asfnancabprwuei1924830149324',
                  description: 'Here some description',
                  enable: true,
                  owner: user.id,
                }).then(function(device) {
                  user.devices = [device];
                  return Credential.create({
                      owner: user.id,
                      devices: device.id
                    }).then(function(credential){
                      user.credentials = [credential];
                      credential.devices = [device];
						          assert.equal(user.name, 'Neil', 'should have set the first name');
						          assert.equal(user.surname, 'Armstrong', 'should have set the last name');
						          assert.equal(user.devices.length, 1, 'There is no device');
                      assert.equal(user.credentials.length, 1, 'There is no credential');
						          var datTemp = user.toJSON();
						          //console.log(datTemp);
                      return user.save();
										}).catch(function(err) {
                      return console.log(err, err.stack);
                    });
								});
						});
        });
    });

    test('should be able to retrieve a user', function() {
      var User = waterline.collections.user;
      return User.find().populate(['roles', 'credentials', 'devices']).exec(function(err, users){
        console.log("User find");
        if (err) {
          console.log("error!");
          return console.log(err.stack);
        } else {
          console.log('length: %d', users.length);
          var userTest = users.pop();
          console.log("Found credentials: %j", userTest.credentials);
          console.log("Found roles: %j", userTest.roles);
          console.log("Found devices: %j", userTest.devices);
          return console.log("Found user: %j", userTest.toJSON());
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
        cel: '55 9 9919 9919',
        confirmed: true
      }).then(function (users) {
        if (users.constructor === Array) {
          console.log("users length: %d", users.length);
          console.log("users: %j", users.toJSON());
          var user = users.pop();
          console.log("Array!");
          console.log("User findOrCreate: %j", user.toJSON());
        } else{
          var user2 = users;
          console.log("User findOrCreate: %j", user2.toJSON());
       }
     }).catch(function(err) {
       console.log(err);
     });
    });

    test('should delete user', function() {
      var User = waterline.collections.user;
      var Device = waterline.collections.device;
      var Credential = waterline.collections.credential;
      var Roles = waterline.collections.role;

      return User.destroy({name: 'Neil', surname: 'Armstrong'}).then(function(users){
        console.log("Entrou destroy");
        console.log(users);
        var userIds = users.map(function(user){return user.id;});
        console.log(userIds);
        return Device.destroy({owner: userIds}).then(function(devices){
          console.log(devices);
          return Credential.destroy({owner: userIds}).then(function(credentials) {
            console.log(credentials);
            return Roles.destroy({owner: userIds}).then(function(roles) {
              console.log(roles);
            }).catch(function(err) {
              if (err) {
                return console.log(err);
              }
            });
          });
        });
      }).catch(function(err) {
        if (err) {
          return console.log(err);
        }
      });

    });
});
