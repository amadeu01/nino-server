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
var employee = require ('../persistence/employees.js');
var student = require('../persistence/students.js');
var guardian = require('../persistence/guardians.js');
var profile = require('../persistence/profiles.js');
//var account = require('../mechanisms/database.js');

//Returned variables
var accnt;
var prfl;
var schl;
var clss;
var rm;


var dctr;
var stdnt;
var grdn;

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
			cellphone: "+5519909876543",
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
		});
	});

	test('Should check if Confirmed Account - Before', function () {
		return account.findWithHash("mysupersecrethash")
		.then(function(res) {
			console.log(res);
			if (res.account.confirmed === false) return (res);
			else throw(res);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should confirm Account email', function() {
		return account.confirmAccount("mysupersecrethash", "mydupernewpassword")
		.then(function (res) {
			console.log(res);
			return(res);
		}).catch(function (err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should check if Confirmed Account - After', function () {
		return account.findWithHash("mysupersecrethash")
		.then(function(res) {
			console.log(res);
			if (res.account.confirmed === true) return (res);
			else throw(res);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
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
			email: "myemail@schoolX.com",
			name: "School X"
		};
		return school.create(schoolMod, prfl.id)
		.then(function(done) {
			schl = done.school;
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should Create Class to School', function() {
		var myClass = {
			name: "Prezinho",
		};
		return _class.create(myClass, schl.id)
		.then(function(done) {
			clss = done.class;
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should Create Room to Class', function() {
		var myRoom = {
			name: "Um",
			notificationGroup: "thisroomgroup"
		};
		return room.create(myRoom, clss.id)
		.then(function(done) {
			rm = done.room;
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should Create Educator to School', function() {
		var eduacc = {
			email: "danilobecke@gmail.com",
			cellphone: "+5519912345678",
			hash: "secondhashsuchsecretwow"
		};
		var eduprof = {
			name: "Danilo",
			surname: "Becke",
			birthdate: new Date(),
			gender: 0
		};
		return employee.createEducator(schl.id, eduacc, eduprof)
		.then(function(done) {
			dctr = done.employee;
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should Create Student to School in Class', function() {
		var stuprof = {
			name: "Amadeu",
			surname: "Cavalcante",
			birthdate: new Date(),
			gender: 0
		};
		return student.create(stuprof, schl.id, rm.id)
		.then(function(done) {
			stdnt = done.student;
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should Create Guardian to student', function() {
		var guardprof = {
			name: "Alfredo",
			surname: "Cavalcante",
			birthdate: new Date(),
			gender: 0
		};
		var guardAcc = {
			email: "alfredo.cnt@gmail.com",
			cellphone: "+5519912345678",
			hash: "thirdhashsuchsecretwowmuchwow"
		};
		return guardian.create(guardAcc, guardprof, stdnt.id)
		.then(function(done) {
			grdn = done.guardian;
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should Read School', function() {
		return school.findWithId(schl.id)
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should Read Classes for School', function() {
		return _class.findWithSchoolId(schl.id)
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should Read Rooms for Class', function() {
		return room.findWithClassId(clss.id)
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should Read Students for Room', function() {
		return student.findWithRoomId(rm.id)
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should Read Profile Info', function() {
		return profile.findWithId(prfl.id)
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});
	
	test('Should Read Profile s Employee info', function() {
		return employee.findWithProfileId(prfl.id)
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});
	
	test('Should Read Guaridian s Students info', function() {
		return student.findWithGuardianId(grdn.id)
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});
	
	test('Should Read Profile s Guardian info', function() {
		return guardian.findWithProfileId(4)
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

	test('Should Read Credential', function() {
		return credential.read("thisismysuperdupertoken")
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

});
