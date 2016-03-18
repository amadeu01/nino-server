/**
Author: Amadeu Cavalcante
Model for testing, using mocha.
*/

var assert = require('assert');
var Waterline = require('waterline');
var sailsMemoryAdapter = require('sails-memory');

suite('User', function () {
    var waterline = new Waterline();
    var config = {
        adapters: {
            'sails-memory': sailsMemoryAdapter
        },
        connections: {
            default: {
                adapter: 'sails-memory'
            }
        }
    }

    setup(function (done) {
        waterline.loadCollection(require('./models/db/User.js'));
        waterline.loadCollection(require('./models/db/User.js'));
        waterline.loadCollection(require('./models/db/User.js'));

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

        return User.create({
                name: 'Neil',
                surname: 'Armstrong',
                username: 'neil',
                password: 'password',
                email: 'neil@ninoapp.com.br',
                cel: '5519 9 9999 9999',
                confirmed: true
            })
            .then(function (user) {
                assert.equal(user.name, 'Neil', 'should have set the first name');
                assert.equal(user.surname, 'Armstrong', 'should have set the last name');
            });
    });
});
