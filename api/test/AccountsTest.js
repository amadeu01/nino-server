var assert = require('assert');
var fake = require('Faker');
var app = require('../app.js');
var request = require('supertest');

var accountsDAO = require('../persistence/accounts.js');

module.exports = function() {
	this.email;
	this.token;
	this.password = "ninoapp";
	var hash;
	suite('Account Profile and Credential BO', function () {
		setup(function (done) {
			done();
		});
		
		teardown(function () {
			return;
		});
		
		

		test('Should Create Account', function() {
			return new Promise(function(resolve, reject) {
				var name = fake.Name.firstName();
				var surname = fake.Name.lastName();
				this.email = fake.Internet.email();
				request(app)
				.post('/accounts')
				.send({ email: this.email, name: name, surname: surname })
				.set('Accept', 'application/json')
				.expect(200)
				.end(function(err, res) {
					console.log(this.email);
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
				accountsDAO.getHash(this.email)
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
				.send({password: this.password})
				.set('Accept', 'application/json')
				.expect(200)
				.end(function(err, res) {
					console.log(res.body);
					console.log(this.password);
					if (err) reject(err);
					else {
						if (res.body.data.token !== undefined) {
							this.token = res.body.data.token;
							resolve(res.body.data.token);
						}
						else reject(res.body)
					}
				});
			});
		})
		
		test('Should Check if User Confirmed', function() {
			return new Promise(function(resolve, reject) {
				accountsDAO.getHash(this.email)
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

		test('Should Create School', function() {
			return new Promise(function(resolve, reject) {
				request(app)
				.post('/schools')
				.send({
					addr: fake.Address.streetAddress(),
					name: fake.Company.companyName(),
					telephone: fake.PhoneNumber.phoneNumber(),
					email: fake.Internet.email(),
					token: token
				}).expect(200)
				.end(function(err, res) {
					if (err) reject(err);
					else {
						if (res.body.data.school !== undefined) resolve(res.body.data.school);
						else reject(res.body.data.school);
					}
				});
			});
		});
	});
};
