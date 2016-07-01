
var createAccounts = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS accounts' + 
				'(id	SERIAL PRIMARY KEY,' + 
				 'email	VARCHAR UNIQUE NOT NULL,' +
				 'password	VARCHAR,' + 
				 'cellphone	VARCHAR,' +
				 'hash	VARCHAR UNIQUE NOT NULL,' +
				 'confirmed	BOOLEAN NOT NULL DEFAULT false,' + 
				 'lost BOOLEAN NOT NULL DEFAULT false)'
				, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createCredentials = function(client) {
	return new Promise(function(resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS credentials' +
				'(id	SERIAL PRIMARY KEY,' +
				 'account	INTEGER REFERENCES accounts (id) ON DELETE CASCADE' +
				 'device	VARCHAR NOT NULL' +
				 'notifiable	BOOLEAN NOT NUL DEFAULT false' + 
				 'notificationID	VARCHAR' + 
			     'token	VARCHAR)'
			, function(err, result) {

		})
	})
};

var createProfiles = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS profiles' +
			'(id	SERIAL PRIMARY KEY,' +
			 'name	VARCHAR,' +
			 'surname	VARCHAR,' +
			 'profilePicture	VARCHAR,' +
			 'birthdate	TIMESTAMPTZ,' +
			 'gender	INTEGER)' 
			, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createSchools = function(client) {
	return new Promise(function (resolve, reject) {
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
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createClasses = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS schools' +
			'(id	SERIAL PRIMARY KEY,' +
			 'name	VARCHAR,' +
		   	 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' +
			 'menu	REFERENCES menus (id))'
			, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createRooms = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS rooms' +
			'(id	SERIAL PRIMARY KEY,' +
			 'name	VARCHAR NOT NULL,' +
			 'class INTEGER REFERENCES classes (id),' +
			 'notificationGroup	VARCHAR)'
			, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createStudent = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS students' +
			'(id	SERIAL PRIMARY KEY,' +
			 'profile	INTEGER REFERENCES profiles (id),' +
			 'school	INTEGER REFERENCES schools (id),' +
			 'room	INTEGER REFERENCES rooms (id))'
			, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createGuardians = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS students' +
			'(id	SERIAL PRIMARY KEY,' +
			 'profile	INTEGER REFERENCES profiles (id))'
			, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createEmployee = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS employees' +
			'(id	SERIAL PRIMARY KEY,' +
			 'profile	INTEGER REFERENCES profiles (id),' +
			 'school	INTEGER REFERENCES schools (id))'
			, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createMenu = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS menus' +
			'(id	SERIAL PRIMARY KEY,' +
			 'school INTEGER REFERENCES schools (id) ON DELETE CASCADE,' +
			 'description	VARCHAR NOT NULL)'
			, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createActivities = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS activities' +
			'(id	SERIAL PRIMARY KEY,' +
			 'name	VARCHAR NOT NULL,' +
			 'description	VARCHAR NOT NULL,' +
			 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE)'
			, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createEvents = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS events' +
			'(id	SERIAL PRIMARY KEY,' + 
			 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' + 
			 'room	INTEGER REFERENCES rooms (id) ON DELETE CASCADE,' +
			 'class	INTEGER REFERENCES classes (id) ON DELETE CASCADE,' +
			 'date	TIMESTAMPTZ,' +
			 'description	VARCHAR NOT NULL)'
			, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createDrafts = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS drafts' +
			'(id	SERIAL PRIMARY KEY,' + 
			 'message	VARCHAR,' +
			 'attachment	VARCHAR,' +
			 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' + 
			 'class	INTEGER REFERENCES classes (id) ON DELETE CASCADE,' +
			 'room	INTEGER REFERENCES rooms (id) ON DELETE CASCADE,' +
			 'type	INTEGER NOT NULL)'
			, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var createPosts = function(client) {
	return new Promise(function (resolve, reject) {
		client.query('CREATE TABLE IF NOT EXISTS posts' +
			'(id	SERIAL PRIMARY KEY,' + 
			 'message	VARCHAR,' +
			 'attachment	VARCHAR,' +
			 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' + 
			 'class	INTEGER REFERENCES classes (id) ON DELETE CASCADE,' +
			 'room	INTEGER REFERENCES rooms (id) ON DELETE CASCADE,' +
			 'date	TIMESTAMPTZ DEFAULT current_timestamp'
			 'type	INTEGER NOT NULL)'
			, function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

var db = {
	createTables: function(client) {
		return new Promise.all([createProfiles(client), createAccounts(client)]);
	}
};

module.exports = db;
