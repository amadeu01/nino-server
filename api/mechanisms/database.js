var models = require('../models');
var pg = require('pg');
var pool = new pg.Pool(models.config);

var createAccounts = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject (err);
				return;
			}
			console.log("Creating Accounts");
			client.query('CREATE TABLE IF NOT EXISTS accounts' + 
					'(id	SERIAL PRIMARY KEY,' + 
					 'profile	INTEGER REFERENCES profiles (id) ON DELETE CASCADE,' +
					 'email	VARCHAR UNIQUE NOT NULL,' +
					 'password	VARCHAR,' + 
					 'cellphone	VARCHAR,' +
					 'hash	VARCHAR UNIQUE NOT NULL,' +
					 'confirmed	BOOLEAN NOT NULL DEFAULT false,' + 
					 'lost BOOLEAN NOT NULL DEFAULT false)'
					, function(err, result) {
						done();
						console.log("Accounts Done");
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createCredentials = function(pool) {
	return new Promise(function(resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			console.log("CreatingCredentials");
			client.query('CREATE TABLE IF NOT EXISTS credentials' +
					'(id	SERIAL PRIMARY KEY,' +
					 'account	INTEGER REFERENCES accounts (id) ON DELETE CASCADE,' +
					 'device	VARCHAR NOT NULL,' +
					 'notifiable	BOOLEAN NOT NULL DEFAULT false,' + 
					 'notificationID	VARCHAR,' + 
					 'token	VARCHAR NOT NULL)'
				, function(err, result) {
						done();
						console.log("Credentials Done")
				if (err) reject(err);
				else resolve(result);
			})
		});
	});
};

var createProfiles = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			console.log("CreatingProfiles");
			client.query('CREATE TABLE IF NOT EXISTS profiles' +
				'(id	SERIAL PRIMARY KEY,' +
				 'name	VARCHAR NOT NULL,' +
				 'surname	VARCHAR NOT NULL,' +
				 'profilePicture	VARCHAR,' +
				 'birthdate	TIMESTAMPTZ,' +
				 'gender	INTEGER)' 
				, function(err, result) {
						done();
						console.log("Profiles Done")
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createSchools = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) { 
				reject (err);
				return;
			}
			console.log("Creating Schools");
			client.query('CREATE TABLE IF NOT EXISTS schools' +
				'(id	SERIAL PRIMARY KEY,' +
				 'owner	INTEGER REFERENCES accounts (id) ON DELETE RESTRICT,' +
				 'notificationGroup	VARCHAR,' +
				 'address	VARCHAR,' +
				 'cnpj	VARCHAR,' +
				 'logo	VARCHAR,' +
				 'telephone	VARCHAR,' +
				 'email	VARCHAR UNIQUE NOT NULL,' +
				 'name	VARCHAR)' 
				, function(err, result) {
						done();
						console.log("Schools done");
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createClasses = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			console.log("Creating Classes")
			client.query('CREATE TABLE IF NOT EXISTS classes' +
				'(id	SERIAL PRIMARY KEY,' +
				 'name	VARCHAR NOT NULL,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' +
				 'menu	INTEGER REFERENCES menus (id) ON DELETE SET NULL)'
				, function(err, result) {
						done();
						console.log("Classes Done");
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createRooms = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			console.log("Creating Rooms");
			client.query('CREATE TABLE IF NOT EXISTS rooms' +
				'(id	SERIAL PRIMARY KEY,' +
				 'name	VARCHAR NOT NULL,' +
				 'class INTEGER REFERENCES classes (id) ON DELETE CASCADE,' +
				 'notificationGroup	VARCHAR)'
				, function(err, result) {
						done();
						console.log("Rooms Done");
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createStudents = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			console.log("Creating Students")
			client.query('CREATE TABLE IF NOT EXISTS students' +
				'(id	SERIAL PRIMARY KEY,' +
				 'profile	INTEGER REFERENCES profiles (id) ON DELETE CASCADE,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE SET NULL,' +
				 'room	INTEGER REFERENCES rooms (id) ON DELETE SET NULL)'
				, function(err, result) {
						done();
						console.log("Students Done");
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createGuardians = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			console.log("CreatingGuardians");
			client.query('CREATE TABLE IF NOT EXISTS guardians' +
				'(id	SERIAL PRIMARY KEY,' +
				 'profile	INTEGER REFERENCES profiles (id) ON DELETE CASCADE)'
				, function(err, result) {
						done();
						console.log("Guardians Done");
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createEmployees = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			console.log("Creating Employees")
			client.query('CREATE TABLE IF NOT EXISTS employees' +
				'(id	SERIAL PRIMARY KEY,' +
				 'profile	INTEGER REFERENCES profiles (id) ON DELETE CASCADE,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE SET NULL)'
				, function(err, result) {
						done();
						console.log("Employees done");
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createMenus = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			console.log("Creatings Menu")
			client.query('CREATE TABLE IF NOT EXISTS menus' +
				'(id	SERIAL PRIMARY KEY,' +
				 'school INTEGER REFERENCES schools (id) ON DELETE CASCADE,' +
				 'description	VARCHAR NOT NULL)'
				, function(err, result) {
						done();
						console.log("Menus Done")
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createActivities = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			console.log("Creating Activities");
			client.query('CREATE TABLE IF NOT EXISTS activities' +
				'(id	SERIAL PRIMARY KEY,' +
				 'name	VARCHAR NOT NULL,' +
				 'description	VARCHAR NOT NULL,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE)'
				, function(err, result) {
						done();
						console.log("Activities Done");
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createEvents = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) { 
				reject (err);
				return;
			}
			console.log("Creating Events");
			client.query('CREATE TABLE IF NOT EXISTS events' +
				'(id	SERIAL PRIMARY KEY,' + 
				 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' + 
				 'room	INTEGER REFERENCES rooms (id) ON DELETE CASCADE,' +
				 'class	INTEGER REFERENCES classes (id) ON DELETE CASCADE,' +
				 'date	TIMESTAMPTZ,' +
				 'description	VARCHAR NOT NULL)'
				, function(err, result) {
						done();
						console.log("Events Done");
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createDrafts = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) { 
				reject (err);
				return;
			}
			console.log("Creating Drafts")
			client.query('CREATE TABLE IF NOT EXISTS drafts' +
				'(id	SERIAL PRIMARY KEY,' + 
				 'message	VARCHAR,' +
				 'attachment	VARCHAR,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' + 
				 'class	INTEGER REFERENCES classes (id) ON DELETE CASCADE,' +
				 'room	INTEGER REFERENCES rooms (id) ON DELETE CASCADE,' +
				 'type	INTEGER NOT NULL)'
				, function(err, result) {
						done();
						console.log("Drafts Done");
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createPosts = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject (err);
				return;
			}
			console.log("Creating Posts");
			client.query('CREATE TABLE IF NOT EXISTS posts' +
				'(id	SERIAL PRIMARY KEY,' + 
				 'message	VARCHAR,' +
				 'attachment	VARCHAR,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' + 
				 'class	INTEGER REFERENCES classes (id) ON DELETE CASCADE,' +
				 'room	INTEGER REFERENCES rooms (id) ON DELETE CASCADE,' +
				 'date	TIMESTAMPTZ DEFAULT current_timestamp,' +
				 'type	INTEGER NOT NULL)'
				, function(err, result) {
						done();
						console.log("Posts Done");
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var db = {
	createTables: function() {
		return new Promise(function (resolve, reject) {
			createProfiles(pool)
			.then(function(done) {
				console.log(done);
				return createAccounts(pool);
			}).then(function(done) {
				console.log(done);
				return Promise.all([createCredentials(pool), createSchools(pool), createGuardians(pool)]);
			}).then(function(done) {
				console.log(done);
				return Promise.all([createActivities(pool), createMenus(pool), createEmployees(pool)]);
			}).then(function(done) {
				console.log(done);
				return createClasses(pool);
			}).then(function(done) {
				console.log(done);
				return createRooms(pool);
			}).then(function (done) {
				console.log(done);
				return Promise.all([createDrafts(pool), createPosts(pool), createEvents(pool), createStudents(pool)]);
			}).then(function(success) {
				console.log("DONE: " + success);
				resolve(success);
			})
			.catch(function(err) {
				console.log("ERROR: " + err);
				reject(err);
			});
		});
	},
	pool: pool,
};

module.exports = db;
