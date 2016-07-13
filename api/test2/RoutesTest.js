/**
* Carlos Millani
* Module services
* Last to modified: Amadeu Cavalcante
*/

var assert = require('assert');
var models = require('../models');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');
var app = require('../app');
var request = require('supertest');

suite('Routes', function () {

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

	test('Should Create School', function () {
		return new Promise (function(resolve, reject) {
			request(app)
		  .post('/schools')
			.send({
				owner: {
					name: 'Danilo',
					surname: 'Becke',
					password: 'dandan',
					email: 'dannil@dani.com',
					cel: '128329830'
				},
				school: {
					name: 'Escolinha Do Danilinho',
					email: 'becke@becke.com.br'
				}
			})
		  .expect('Content-Type', /json/)
		  .expect(200)
			.expect(function(res) {
				// console.log('>>><<<<');
				// console.log(res.body);
				// console.log('>>><<<<');
			})
		  .end(function(err, res) {
				// console.log(res.body);
		    if (err) reject(err);
				else resolve(res.body);
		  });
		})
		.then(function(body) {
			assert.strictEqual(isNaN(body.school), false, 'school isNaN');
			assert.strictEqual(isNaN(body.educator), false, 'educator isNaN');
			assert.strictEqual(isNaN(body.user), false, 'user isNaN');
		});
	});
	test('Login Recently Created Educator', function () {
		return new Promise (function(resolve, reject) {
			request(app)
		  .post('/credentials/educators')
			.send({
				password: 'dandan',
				email: 'dannil@dani.com'
			})
		  .expect('Content-Type', /json/)
		  .expect(200)
			.expect(function(res) {
				// console.log('>>><<<<');
				// console.log(res.body);
				// console.log('>>><<<<');
			})
		  .end(function(err, res) {
		    if (err) reject(err);
				else resolve(res.body);
		  });
		})
		.then(function(body) {
			assert.strictEqual((body.token === undefined), false, 'school isNaN');
		});
	});

});
