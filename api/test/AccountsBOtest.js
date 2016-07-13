/**
* Carlos Millani
* Module test
*/

var fs = require('fs');
var assert = require('assert');
var accountsBO = require('../business/accounts.js');
//var account = require('../mechanisms/database.js');

//Returned variables
var device = "Mac Test";
var password = "superpassword";
var email = "amadeu@ninoapp.com.br";
var cellphone = "+5585981501028";
var prfl;
var schl;
var clss;
var rm;
var confirmationHash = "";
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
			email: email,
			cellphone: cellphone
		};

		var profile = {
			name: "Amadeu",
			surname: "Cavalcante",
			birthdate: "27/01/1994",
			gender: 0
		};
		// console.log("Account :");
		// console.log(account);
		// console.log("Profile :");
		// console.log(profile);

		return accountsBO.createNewUserTest(account, profile)
		.then(function(res){
			confirmationHash = res.json.data.hash;
			var data = "Code: " + JSON.stringify(res.code) + "\n";
			data += "##########################\n";
			data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
			data += "##########################\n";
			data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
			return fs.writeFile("./results/Results_for_createUser.txt", data, 'utf8', function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("The file results was saved!");
			});
		}).catch(function(err){
			console.log(err);
		});

	});

	test('Should Check whether the user is confirmed or not', function() {
		console.log(confirmationHash);

		return accountsBO.findWithHash(confirmationHash)
		.then(function(res){
			var data = "Code: " + JSON.stringify(res.code) + "\n";
			data += "##########################\n";
			data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
			data += "##########################\n";
			data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
			//console.log(res);
		}).catch(function(err){
			console.log(err);
		});
	});

	test('Should confirm account and ', function() {


		return accountsBO.confirmAccount(confirmationHash, device, password)
		.then(function(res){
			var data = "Code: " + JSON.stringify(res.code) + "\n";
			data += "##########################\n";
			data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
			data += "##########################\n";
			data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
			return fs.writeFile("./results/Results_for_confirmAccount.txt", data, 'utf8', function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("The file results was saved!");
			});
		}).catch(function(err){
			console.log(err);
		});
	});

	// test('Should Create Student to School in Class', function() {
	//
	// });
	//
	// test('Should Create Guardian to student', function() {
	//
	// });

	test('Should Login in the server', function() {

		return accountsBO.login(email, password, device)
		.then(function(res) {
			console.log("Entrou");
			var data = "Code: " + JSON.stringify(res.code) + "\n";
			data += "##########################\n";
			data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
			data += "##########################\n";
			data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
			return fs.writeFile("./results/Results_for_LoginUser.txt", data, 'utf8', function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("The file results was saved!");
			});
		}).catch(function(err){
			console.log("Deu Erro hue hue hue");
			console.log(err);
		});
	});

});
