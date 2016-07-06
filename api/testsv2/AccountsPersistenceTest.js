/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var account = require('../persistence/accounts.js');
var credential = require('../persistence/credentials.js');
var school = require ('../persistence/schools.js');
var _class = require ('../persistence/classes.js');
var room = require ('../persistence/rooms.js');
//var account = require('../mechanisms/database.js');

//Returned variables
var accnt;
var prfl;
var schl;
var clss;
var rm;

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
			accnt = res.account;
			prfl = res.profile;
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
	
	test('Should Create School', function() {
		var schoolMod = {
			notificationGroup: "mydupergroup",
			address: "righthererightnow",
			cnpj: "mycnpj",
			email: "myemail@email.com",
			name: "My Name"
		}
		return school.create(schoolMod, accnt)
		.then(function(done) {
			schl = done.school;
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		})
	});
	
	test('Should Create Class to School', function() {
		var myClass = {
			name: "Prezinho",
		} 
		return _class.create(myClass, schl)
		.then(function(done) {
			clss = done.class;
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		})
	});
	
	test('Should Create Room to Class', function() {
		var myRoom = {
			name: "Um",
			notificationGroup: "thisroomgroup"
		} 
		return room.create(myRoom, clss)
		.then(function(done) {
			rm = done.room;
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		})
	});	
	
});
