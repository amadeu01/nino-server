/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var accountsBO = require('../business/accounts.js');
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

suite('Account Profile and Credential BO', function () {

	setup(function (done) {
		done();
	});

	teardown(function () {
		return;
	});



	test('Should Create User', function() {
		var account = {
			email: "amadeu@ninoapp.com.br",
			cellphone: "85981501028"
		};

		var profile = {
			name: "Amadeu",
			surname: "Cavalcante",
			birthdate: "27/01/1994",
			gender: 0
		};

		return accountsBO.createNewUser(account, profile)
		.then(function(res){
			console.log(res);
		}).catch(function(err){
			console.log(err);
		});
	});

	test('Should Check whether the user is confirmed or not', function() {

	});

	test('Should Create Student to School in Class', function() {

	});

	test('Should Create Guardian to student', function() {

	});

	test('Should Login in the server', function() {

	});


});
