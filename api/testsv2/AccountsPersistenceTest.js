/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var account = require('../persistence/accounts.js');
//var account = require('../mechanisms/database.js');

suite('Account Persistence', function () {

	setup(function (done) {
		done();
	});

	teardown(function () {
		return;
	});

	//Create
	test('should create User', function () {
		this.timeout(10000);
		var acc = {
			email: "carloseduardomillani@gmail.com",
			cellphone: "+5519984187636",
			password: "senhafacil"
		};
		var profile = {
			name: "Carlos",
			surname: "Millani",
			birthdate: new Date(),
			gender: 0
		};
		return account.createNewUser(acc, profile)
		.then(function(res) {
			console.log(res);
		});
	});

});
