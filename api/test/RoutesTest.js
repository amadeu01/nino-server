var assert = require('assert');
var fake = require('Faker');
var app = require('../app.js');
var request = require('supertest');

var accountsDAO = require('../persistence/accounts.js');

suite('Account Profile and Credential BO', function () {
	setup(function (done) {
		done();
	});
	
	teardown(function () {
		return;
	});
	
	var email;
	var token;
	var hash;

	test('Should Create Account', function() {
		return new Promise(function(resolve, reject) {
			var name = fake.Name.firstName();
			var surname = fake.Name.lastName();
			email = fake.Internet.email();
			request(app)
			.post('/accounts')
			.send({ email: email, name: name, surname: surname })
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, res) {
				if (err) reject(err);
				else {
					if (res.body.data.profile !== undefined) resolve(res.body);
					else reject(res.body);
				}
		  	});
		});
	});

	test('Should Check if User Confirmed', function() {
		return new Promise(function(resolve, reject) {
			accountsDAO.getHash(email)
			.then(function(account) {
				request(app)
				.get('/accounts/authentication/' + account.hash)
				.expect(200)
				.end(function(err, res) {
					if (err) reject(err);
					else {
						if (res.body.data.account.confirmed === false)  {
							hash = account.hash
							resolve(res.body);
						}
						else reject(res.body);
					}
				});
			}).catch(function(err) {
				console.log(err);
				reject(err);
			})	
		});
	});
	
	test('Should Confirm User', function() {
		return new Promise(function(resolve, reject) {
			request(app)
			.post('/accounts/authentication/' + hash)
			.send({password: "ninoapp"})
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, res) {
				if (err) reject(err);
				else {
					if (res.body.data.token !== undefined) {
						token = res.body.data.token;
						resolve(res.body.data.token);
					}
					else reject(res.body)
				}
			});
		});
	})
	
	test('Should Check if User Confirmed', function() {
		return new Promise(function(resolve, reject) {
			accountsDAO.getHash(email)
			.then(function(account) {
				request(app)
				.get('/accounts/authentication/' + account.hash)
				.expect(200)
				.end(function(err, res) {
					if (err) reject(err);
					else {
						if (res.body.data.account.confirmed === true) resolve(account.hash);
						else reject(res.body);
					}
				});
			}).catch(function(err) {
				console.log(err);
				reject(err);
			})
		});
	});

	test('Should Post to self timeline', function() {
	});

});
