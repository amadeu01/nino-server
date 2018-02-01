var assert = require('assert');
var fake = require('Faker');
var app = require('../app.js');
var request = require('supertest');

var accountsDAO = require('../persistence/accounts.js');

module.exports = {
	createSchool: suite('Create School', function(account) {
		setup(function (done) {
			done();
		});

		teardown(function () {
			return;
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
					token: account.token
				}).expect(200)
				.end(function(err, res) {
					if (err) reject(err);
					else {
						if (res.body.data.school !== undefined) {
							account.school = res.body.data.school;
							resolve(res.body.data.school);
						}
						else reject(res.body.data.school);
					}
				});
			});
		});
	});
}