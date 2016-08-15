var assert = require('assert');
var fake = require('Faker');
var app = require('../app.js');
var request = require('supertest');

suite('Account Profile and Credential BO', function () {
	setup(function (done) {
		done();
		console.log("Starting tests");
	});
	
	teardown(function () {
		return;
	});
	
	test('Should Create User Owner', function() {
		request(app)
			.post('/')
			.send({ email: 'carlos@ninoapp.com.br', name: 'Carlos', surname: 'Millani' })
			.set('Accept', 'application/json')
			.end(function(err, res) {
		    console.log(err);
				console.log(res);
		  });
	});
	
});