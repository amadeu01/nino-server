/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var account = require('../persistence/accounts.js');
var credential = require('../persistence/credentials.js');
//var account = require('../mechanisms/database.js');

suite('Account Profile and Credential Persistence', function () {

	setup(function (done) {
		done();
	});

	teardown(function () {
		return;
	});

	//Create
	test('Should create Profile and Account', function () {
		var acc = {
			email: "carloseduardomillani@gmail.com",
			cellphone: "+5519984187636",
			hash: "mysupersecrethash"
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
			return(res);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		})
	});
	
	test('Should confirm Account email', function() {
		return account.confirmAccount("mysupersecrethash", "mydupernewpassword")
		.then(function (res) {
			console.log(res);
			return(res);
		}).catch(function (err) {
			console.log(err);
			throw(err);
		})
	});
	
	test('Should return logIn select', function() {
		return account.logIn("carloseduardomillani@gmail.com")
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function (err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should try create Credential', function() {
		return credential.logIn("My Device", "thisismysuperdupertoken", {id:1})
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});
});
