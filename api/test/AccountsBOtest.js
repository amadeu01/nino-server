/**
* @author Amadeu Cavalcante
* Module test
*/

var fs = require('fs');
var assert = require('assert');
var accountsBO = require('../business/accounts.js');
var schoolsBO = require('../business/schools.js');
var classesBO = require('../business/classes.js');
var roomsBO = require('../business/rooms.js');
var employeesBO = require('../business/employees.js');
var studentsBO = require('../business/students.js');
var fake = require('Faker');
//var account = require('../mechanisms/database.js');

//Returned variables
var device = "Mac Test";
var password = "superpassword";
var email = "amadeu@ninoapp.com.br";
var cellphone = "+5585981501028";
var class_name = "Classe teste";
var room_name = "Sala teste";
var school = {
	name: "Escola Feliz",
	email: "escolafeliz@escolafeliz.com.br",
	address: "Rua Feliz",
	logo: "logo",
	telephone: "+558534768162",
	cnpj: "08123939412"
};

var token;
var rawToken;
var confirmationHash = "";
var school_id;
var class_id;
var room_id;
var fakeData = [];

suite('Account Profile and Credential BO', function () {

	setup(function (done) {
		done();
	});

	teardown(function () {
		return;
	});
	email = fake.Internet.email();
	school.email = fake.Internet.email();
	for (var i = 0; i < 10; i++) {
		fakeData[i] = {};
		fakeData[i].name = fake.Name.firstName();
		fakeData[i].surname = fake.Name.lastName();
		fakeData[i].email = fake.Internet.email();
		fakeData[i].cellphone = fake.PhoneNumber.phoneNumber();
		fakeData[i].address = fake.Address.streetAddress();
		fakeData[i].birthdate = "27/01/1994";
		fakeData[i].device = "iPhone";
		fakeData[i].password = fake.Lorem.words()[0];
	}
	//console.log(fakeData);
	var createUser = function(fakeUser) {
		//console.log(fakeUser);
		return function () {
			var account = {
				email: fakeUser.email,
				cellphone: fakeUser.cellphone
			};

			var profile = {
				name: fakeUser.name,
				surname: fakeUser.surname,
				birthdate: fakeUser.birthdate,
				gender: 0
			};
			// console.log("Account :");
			// console.log(account);
			// console.log("Profile :");
			// console.log(profile);

			return accountsBO.createNewUserTest(account, profile)
			.then(function(res){
				fakeUser.confirmationHash = res.json.data.hash;
			}).then(function(res){
				return accountsBO.confirmAccountTest(fakeUser.confirmationHash, fakeUser.device, fakeUser.password)
				.catch(function(err){
					console.log(err);
				});
			});
		};
	};

	var createStudentsPopulation = function(school_id, room_id, device, rawToken, token) {
		return function() {
			console.log(school_id);
			console.log(room_id);
			console.log(device);
			console.log(rawToken);
			console.log(token);
			var student_profile = {
				name: fake.Name.firstName(),
				surname: fake.Name.lastName(),
				birthdate: 15/02/2013,
				gender: 0
			};
			return studentsBO.create(student_profile, school_id, room_id, device, rawToken, token)
			.then(function(res){
				var data = "Code: " + JSON.stringify(res.code) + "\n";
				data += "##########################\n";
				data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
				data += "##########################\n";
				data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
				//console.log(res.json.data);
				return fs.writeFile("./results/Results_for_CreateStudent" + res.json.data.student.id +".txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					//console.log("The file results was saved!");
				});
			}).catch(function(err){
				console.log("Deu Erro pegando Criando estudante hue hue hue");
				console.log(err);
			});
		};
	};


  // Populate
	for (var j = 0; j < 10; j++) {
		test('Should Populate Data', createUser(fakeData[j]));
	}


	test('Should Create User Owner', function() {
		console.log(email);
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
				//console.log("The file results was saved!");
			});
		}).catch(function(err){
			console.log(err);
		});
	});

	test('Should Check whether the user is confirmed or not', function() {
		//console.log(confirmationHash);

		return accountsBO.findWithHash(confirmationHash)
		.then(function(res){
			var data = "Code: " + JSON.stringify(res.code) + "\n";
			data += "##########################\n";
			data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
			data += "##########################\n";
			data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
			//console.log(res.json.data.account);
		}).catch(function(err){
			console.log(err);
		});
	});

	test('Should confirm account ', function() {
		return accountsBO.confirmAccountTest(confirmationHash, device, password)
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
				//console.log("The file results was saved!");
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

	// Login

		test('Should Login in the server', function() {
			console.log(email);
			return accountsBO.logInTest(email, password, device)
			.then(function(res) {
				//console.log("Entrou");
				var data = "Code: " + JSON.stringify(res.code) + "\n";
				data += "##########################\n";
				data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
				data += "##########################\n";
				data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
				rawToken = res.json.data.rawToken;
				token = res.json.data.token;
				return fs.writeFile("./results/Results_for_LoginUser.txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					//console.log("The file results was saved!");
				});
			}).catch(function(err){
				console.log("Deu Erro hue hue hue");
				console.log(err);
			});
		});

		//School
		test('Should Create School', function() {
			//console.log(token);
			return schoolsBO.create(school, device, rawToken, token)
			.then(function(res){
				var data = "Code: " + JSON.stringify(res.code) + "\n";
				data += "##########################\n";
				data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
				data += "##########################\n";
				data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
				school_id = res.json.data.school.id;
				return fs.writeFile("./results/Results_for_CreateSchool.txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					//console.log("The file results was saved!");
				});
			}).catch(function(err){
				console.log("Deu Erro hue hue hue");
				console.log(err);
			});
		});

		test('Should Read school', function() {
			//this.timeout(5000); //timeout
			//console.log(school_id);
			return schoolsBO.read(school_id, device, rawToken, token)
			.then(function(res){
				var data = "Code: " + JSON.stringify(res.code) + "\n";
				data += "##########################\n";
				data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
				data += "##########################\n";
				data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
				return fs.writeFile("./results/Results_for_ReadSchool.txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					//console.log("The file results was saved!");
				});
			}).catch(function(err){
				console.log("Deu Erro hue hue hue");
				console.log(err);
			});
		});

		//Classes

		test('Should Create Class', function() {
			return classesBO.createClassForSchool(class_name, school_id, device, rawToken, token)
			.then(function(res){
				var data = "Code: " + JSON.stringify(res.code) + "\n";
				data += "##########################\n";
				data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
				data += "##########################\n";
				data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
				class_id = res.json.data.class.id;
				return fs.writeFile("./results/Results_for_CreateClass.txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					//console.log("The file results was saved!");
				});
			}).catch(function(err){
				console.log("Deu Erro Criando Classe hue hue hue");
				console.log(err);
			});
		});

		test('Should Read Class For school', function() {
			// console.log(classesBO);
			// console.log(classesBO.getClassesForSchool);
			return classesBO.getClassesForSchool(school_id, device, rawToken, token).then(function(res){
				// console.log("classesTest");
				// console.log(res);
				var data = "Code: " + JSON.stringify(res.code) + "\n";
				data += "##########################\n";
				data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
				data += "##########################\n";
				data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
				return fs.writeFile("./results/Results_for_ReadClassFrom.txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					//console.log("The file results was saved!");
				});
			}).catch(function(err){
				console.log("Deu Erro Lendo Classe hue hue hue");
				console.log(err);
			});
		});

		//Romm

		test('Should Create Room For Class', function() {
			var room = {
				name: room_name
			};
			return roomsBO.createToClass(room, class_id, device, rawToken, token)
			.then(function(res){
				var data = "Code: " + JSON.stringify(res.code) + "\n";
				data += "##########################\n";
				data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
				data += "##########################\n";
				data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
				room_id = res.json.data.room.id;
				return fs.writeFile("./results/Results_for_CreateRoom.txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					//console.log("The file results was saved!");
				});
			}).catch(function(err){
				console.log("Deu Erro Criando Sala para classe hue hue hue");
				console.log(err);
			});
		});



		test('Should Read Room From Class', function() {
			//console.log(token);
			return roomsBO.getRoomFromClass(class_id, device, rawToken, token)
			.then(function(res){
				var data = "Code: " + JSON.stringify(res.code) + "\n";
				data += "##########################\n";
				data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
				data += "##########################\n";
				data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";

				return fs.writeFile("./results/Results_for_ReadRoomFromClass.txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					//console.log("The file results was saved!");
				});
			}).catch(function(err){
				console.log("Deu Erro lendo sala de classes hue hue hue");
				console.log(err);
			});
		});

		//Employee


		test('Should Create Employee to School', function() {
			//console.log(rawToken);
			var account = {};
			account.email = fake.Internet.email();
			account.cellphone = fake.PhoneNumber.phoneNumber();

			var profile = {};
			profile.name = fake.Name.firstName();
			profile.surname = fake.Name.lastName();
			profile.birthdate = fake.Date.between();
			profile.gender = 0;

			//console.log(employeesBO);
			return employeesBO.createEducator(school_id, profile, account, device, rawToken, token)
			.then(function(res){
				var data = "Code: " + JSON.stringify(res.code) + "\n";
				data += "##########################\n";
				data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
				data += "##########################\n";
				data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
				//console.log(res.json.data);
				return fs.writeFile("./results/Results_for_CreateEducator.txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					//console.log("The file results was saved!");
				});
			}).catch(function(err){
				console.log("Deu Erro criando educators hue hue hue");
				console.log(err);
			});
		});

			test('Should Create Employee (2) to School', function() {

				var account = {};
				account.email = fake.Internet.email();
				account.cellphone = fake.PhoneNumber.phoneNumber();

				var profile = {};
				profile.name = fake.Name.firstName();
				profile.surname = fake.Name.lastName();
				profile.birthdate = fake.Date.between();
				profile.gender = 1;

				//console.log(employeesBO);
				return employeesBO.createEducator(school_id, profile, account, device, rawToken, token)
				.then(function(res){
					var data = "Code: " + JSON.stringify(res.code) + "\n";
					data += "##########################\n";
					data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
					data += "##########################\n";
					data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
					//console.log(res.json.data);
					return fs.writeFile("./results/Results_for_CreateEducator.txt", data, 'utf8', function(err) {
						if(err) {
							return console.log(err);
						}
						//console.log("The file results was saved!");
					});
				}).catch(function(err){
					console.log("Deu Erro criando educators hue hue hue");
					console.log(err);
				});
			});

			test('Should Get Employee', function() {
				token.school = school_id;
				return employeesBO.getEmployeesForSchool(rawToken, token)
				.then(function(res){
					var data = "Code: " + JSON.stringify(res.code) + "\n";
					data += "##########################\n";
					data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
					data += "##########################\n";
					data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
					//console.log(res.json.data);
					return fs.writeFile("./results/Results_for_GetEmployees.txt", data, 'utf8', function(err) {
						if(err) {
							return console.log(err);
						}
						//console.log("The file results was saved!");
					});
				}).catch(function(err){
					console.log("Deu Erro pegando lista de funcionarios hue hue hue");
					console.log(err);
				});
			});


		//Students

		test('Should Create Student to School', function() {
			//console.log(rawToken);
			var student_profile = {
				name: fake.Name.firstName(),
			  surname: fake.Name.lastName(),
				birthdate: fake.Date.between(),
				gender: 0
			};
			return studentsBO.create(student_profile, school_id, room_id, device, rawToken, token)
			.then(function(res){
				var data = "Code: " + JSON.stringify(res.code) + "\n";
				data += "##########################\n";
				data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
				data += "##########################\n";
				data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
				//console.log(res.json.data);
				return fs.writeFile("./results/Results_for_CreateStudent.txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					//console.log("The file results was saved!");
				});
			}).catch(function(err){
				console.log("Deu Erro pegando Criando estudante hue hue hue");
				console.log(err);
			});

		});

		test('Should Get all students for room', function() {
			return studentsBO.readForRoom(room_id, device, rawToken, token)
			.then(function(res){
				var data = "Code: " + JSON.stringify(res.code) + "\n";
				data += "##########################\n";
				data += "JSON.data: " + JSON.stringify(res.json.data) + "\n";
				data += "##########################\n";
				data += "JSON.error: " + JSON.stringify(res.json.error) + "\n";
				//console.log(res.json.data);
				return fs.writeFile("./results/Results_for_GetAllStudentsForRoom.txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					//console.log("The file results was saved!");
				});
			}).catch(function(err){
				console.log("Deu Erro pegando Criando estudante hue hue hue");
				console.log(err.data);
			});
		});
});
