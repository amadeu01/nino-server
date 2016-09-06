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
			client.query('CREATE TABLE IF NOT EXISTS accounts' + 
					'(id	SERIAL PRIMARY KEY,' + 
					 'profile	INTEGER REFERENCES profiles (id) ON DELETE CASCADE,' +
					 'email	VARCHAR UNIQUE NOT NULL,' +
					 'password	VARCHAR,' + 
					 'cellphone	VARCHAR,' +
					 'salt	VARCHAR,' +
					 'hash	VARCHAR UNIQUE NOT NULL,' +
					 'passwordHash	VARCHAR UNIQUE,' +
					 'confirmed	BOOLEAN NOT NULL DEFAULT false,' + 
					 'active BOOLEAN NOT NULL DEFAULT true,' + 
					 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
					 'modified TIMESTAMP DEFAULT current_timestamp,' +
					 'lost BOOLEAN NOT NULL DEFAULT false)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createContents = function(pool) {
	return new Promise(function(resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS contents' +
					'(id	SERIAL PRIMARY KEY,' +
					 'profile	INTEGER REFERENCES profiles (id) ON DELETE CASCADE,' +
					 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' +
					 'key	VARCHAR UNIQUE NOT NULL,' +
					 'access	INTEGER NOT NULL DEFAULT 0,' +			
					 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
				   'modified TIMESTAMP DEFAULT current_timestamp,' +
					 'CHECK ((school IS NOT NULL AND profile IS NULL) OR (school IS NULL AND profile IS NOT NULL)))', 
			function(err, result) {
				done();
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
			client.query('CREATE TABLE IF NOT EXISTS credentials' +
					'(id	SERIAL PRIMARY KEY,' +
					 'account	INTEGER REFERENCES accounts (id) ON DELETE CASCADE,' +
					 'device	VARCHAR NOT NULL,' +
					 'notifiable	BOOLEAN NOT NULL DEFAULT false,' + 
					 'notificationID	VARCHAR,' + 
					 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
					 'modified TIMESTAMP DEFAULT current_timestamp,' +
					 'token	VARCHAR NOT NULL)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
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
			client.query('CREATE TABLE IF NOT EXISTS profiles' +
				'(id	SERIAL PRIMARY KEY,' +
				 'name	VARCHAR,' +
				 'surname	VARCHAR,' +
				 'picture	VARCHAR,' +
				 'birthdate	TIMESTAMPTZ,' +
				 'active BOOLEAN NOT NULL DEFAULT true,' + 
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
			   'modified TIMESTAMP DEFAULT current_timestamp,' +
				 'gender	INTEGER)' , 
			function(err, result) {
				done();
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
			client.query('CREATE TABLE IF NOT EXISTS schools' +
				'(id	SERIAL PRIMARY KEY,' +
				 'owner	INTEGER REFERENCES profiles (id) ON DELETE RESTRICT NOT NULL,' +
				 'notificationGroup	VARCHAR,' +
				 'address	VARCHAR,' +
				 'cnpj	VARCHAR,' +
				 'logo	VARCHAR,' +
				 'telephone	VARCHAR,' +
				 'email	VARCHAR UNIQUE NOT NULL,' +
				 'expiration	TIMESTAMP DEFAULT current_timestamp + interval \'1 year\',' +
				 'active BOOLEAN NOT NULL DEFAULT true,' + 
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
			   'modified TIMESTAMP DEFAULT current_timestamp,' +
				 'name	VARCHAR)' ,
			function(err, result) {
				done();
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
			client.query('CREATE TABLE IF NOT EXISTS classes' +
				'(id	SERIAL PRIMARY KEY,' +
				 'name	VARCHAR NOT NULL,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE NOT NULL,' +
				 'active	BOOLEAN NOT NULL DEFAULT true,' + 
				 'agenda	INTEGER DEFAULT 0,' +
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
			   'modified TIMESTAMP DEFAULT current_timestamp,' +
				 'menu	INTEGER REFERENCES menus (id) ON DELETE SET NULL)', 
			function(err, result) {
				done();
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
			client.query('CREATE TABLE IF NOT EXISTS rooms' +
				'(id	SERIAL PRIMARY KEY,' +
				 'name	VARCHAR NOT NULL,' +
				 'class INTEGER REFERENCES classes (id) ON DELETE CASCADE NOT NULL,' +
				 'active BOOLEAN NOT NULL DEFAULT true,' + 
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
			   'modified TIMESTAMP DEFAULT current_timestamp,' +
				 'notificationGroup	VARCHAR)', 
			function(err, result) {
				done();
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
			client.query('CREATE TABLE IF NOT EXISTS students' +
				'(id	SERIAL PRIMARY KEY,' +
				 'profile	INTEGER REFERENCES profiles (id) ON DELETE CASCADE NOT NULL,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE SET NULL,' +
				 'active BOOLEAN NOT NULL DEFAULT true,' + 
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
			   'modified TIMESTAMP DEFAULT current_timestamp,' +
				 'room	INTEGER REFERENCES rooms (id) ON DELETE SET NULL)', 
			function(err, result) {
				done();
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
			client.query('CREATE TABLE IF NOT EXISTS employees' +
				'(id	SERIAL PRIMARY KEY,' +
				 'profile	INTEGER REFERENCES profiles (id) ON DELETE CASCADE,' +
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
			   'modified TIMESTAMP DEFAULT current_timestamp,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE SET NULL)',
			function(err, result) {
				done();
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
			client.query('CREATE TABLE IF NOT EXISTS menus' +
				'(id	SERIAL PRIMARY KEY,' +
				 'school INTEGER REFERENCES schools (id) ON DELETE CASCADE,' +
				 'active BOOLEAN NOT NULL DEFAULT true,' + 
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
			   'modified TIMESTAMP DEFAULT current_timestamp,' +
				 'description	VARCHAR NOT NULL)', 
			function(err, result) {
				done();
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
			client.query('CREATE TABLE IF NOT EXISTS activities' +
				'(id	SERIAL PRIMARY KEY,' +
				 'name	VARCHAR NOT NULL,' +
				 'description	VARCHAR NOT NULL,' +
				 'active BOOLEAN NOT NULL DEFAULT true,' + 
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
			   'modified TIMESTAMP DEFAULT current_timestamp,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createAgendasSections = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS agendas_sections' +
				'(id	SERIAL PRIMARY KEY,' +
				 'title	VARCHAR NOT NULL,' +
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
				 'class	INTEGER REFERENCES classes (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createAgendasSectionsRows = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
			   	reject (err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS agendas_sections_rows' +
				'(id	SERIAL PRIMARY KEY,' +
				 'type	INTEGER NOT NULL,' +
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
				 'section	INTEGER REFERENCES agendas_sections (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
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
			client.query('CREATE TABLE IF NOT EXISTS events' +
				'(id	SERIAL PRIMARY KEY,' + 
				 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' + 
				 'room	INTEGER REFERENCES rooms (id) ON DELETE CASCADE,' +
				 'class	INTEGER REFERENCES classes (id) ON DELETE CASCADE,' +
				 'date	TIMESTAMPTZ,' +
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
			   'modified TIMESTAMP DEFAULT current_timestamp,' +
				 'description	VARCHAR NOT NULL)', 
			function(err, result) {
				done();
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
			client.query('CREATE TABLE IF NOT EXISTS drafts' +
				'(id	SERIAL PRIMARY KEY,' + 
				 'message	VARCHAR NOT NULL,' +
				 'attachment	VARCHAR,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' +
				 'metadata	VARCHAR,' +
				 'active BOOLEAN NOT NULL DEFAULT true,' + 
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
			   'modified TIMESTAMP DEFAULT current_timestamp,' +
				 'type	INTEGER NOT NULL)', 
			function(err, result) {
				done();
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
			client.query('CREATE TABLE IF NOT EXISTS posts' +
				'(id	SERIAL PRIMARY KEY,' + 
				 'message	VARCHAR NOT NULL,' +
				 'attachment	VARCHAR,' +
				 'school	INTEGER REFERENCES schools (id) ON DELETE CASCADE,' +
				 'metadata	VARCHAR,' +
				 'date	TIMESTAMPTZ DEFAULT current_timestamp,' +
				 'active BOOLEAN NOT NULL DEFAULT true,' + 
				 'createdAt TIMESTAMP DEFAULT current_timestamp,' +
			   'modified TIMESTAMP DEFAULT current_timestamp,' +
				 'type	INTEGER NOT NULL)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createActivitiesClasses = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS activities_classes' + 
				'(activity	INTEGER REFERENCES activities (id) ON DELETE CASCADE,' +
				 'class	INTEGER REFERENCES classes (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createClassesEducators = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS classes_educators' +
				'(class INTEGER REFERENCES classes (id) ON DELETE CASCADE,' +
				 'educators INTEGER REFERENCES employees (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createDraftsProfiles = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS drafts_profiles' +
				'(draft INTEGER REFERENCES drafts (id) ON DELETE CASCADE,' +
				 'profile INTEGER REFERENCES profiles (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createDraftsAuthors = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS drafts_authors' +
				'(draft INTEGER REFERENCES drafts (id) ON DELETE CASCADE,' +
				 'author INTEGER REFERENCES profiles (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createEducatorRooms = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS educators_rooms' +
				'(educator	INTEGER REFERENCES employees (id) ON DELETE CASCADE,' +
				 'room	INTEGER REFERENCES rooms (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createEventsConfirmations = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS events_confirmations' +
				'(event	INTEGER REFERENCES events (id) ON DELETE CASCADE,' +
				 'profile	INTEGER REFERENCES profiles (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createGuardiansProfileStudents = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS guardians_profile_students' +
				'(guardian_profile	INTEGER REFERENCES profiles (id) ON DELETE RESTRICT,' +
				 'student	INTEGER REFERENCES students (id) ON DELETE RESTRICT)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createPostsProfiles = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS posts_profiles' +
				'(post	INTEGER REFERENCES posts (id) ON DELETE CASCADE,' +
				 'profile	INTEGER REFERENCES profiles ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createPostsAuthors = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS posts_authors' +
				'(post	INTEGER REFERENCES posts (id) ON DELETE CASCADE,' +
				 'author	INTEGER REFERENCES profiles (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createPostsReads = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS posts_reads' +
				'(post	INTEGER REFERENCES posts (id) ON DELETE CASCADE,' +
				 'profile	INTEGER REFERENCES profiles (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createSchoolsPedagogues = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS schools_pedagogues' +
				'(school	INTEGER REFERENCES schools (id) ON DELETE RESTRICT,' +
				 'pedagogue	INTEGER REFERENCES employees (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createSchoolsEducators = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS schools_educators' +
				'(school	INTEGER REFERENCES schools (id) ON DELETE RESTRICT,' +
				 'educator	INTEGER REFERENCES employees (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createSchoolsNutritionists = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS schools_nutritionists' +
				'(school	INTEGER REFERENCES schools (id) ON DELETE RESTRICT,' +
				 'nutritionist	INTEGER REFERENCES employees (id) ON DELETE CASCADE)',
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createSchoolsCoordinators = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TABLE IF NOT EXISTS schools_coordinators' +
				'(school	INTEGER REFERENCES schools (id) ON DELETE RESTRICT,' +
				 'coordinator	INTEGER REFERENCES employees (id) ON DELETE CASCADE)', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var createFunctionModifiedTimestamp = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE OR REPLACE FUNCTION update_modified_column()' +
				'RETURNS TRIGGER AS $$' +
				'BEGIN' +
				'	NEW.modified = now();' +
				'	RETURN NEW;' +
				'END;' +
				'$$ language \'plpgsql\';', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampAccounts = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_accounts_modtime BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampContents = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_contents_modtime BEFORE UPDATE ON contents FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampProfiles = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampSchools = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_schools_modtime BEFORE UPDATE ON schools FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampClasses = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_classes_modtime BEFORE UPDATE ON classes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampRooms = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_rooms_modtime BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampMenus = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_menus_modtime BEFORE UPDATE ON menus FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampActivities = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_activities_modtime BEFORE UPDATE ON activities FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampEvents = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_events_modtime BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampDrafts = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_drafts_modtime BEFORE UPDATE ON drafts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampPosts = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_posts_modtime BEFORE UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampCredentials = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_credentials_modtime BEFORE UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampStudents = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_students_modtime BEFORE UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
};

var triggerTimestampEmployees = function(pool) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('CREATE TRIGGER update_employees_modtime BEFORE UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();', 
			function(err, result) {
				done();
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
				return createAccounts(pool);
			}).then(function(done) {
				return Promise.all([createCredentials(pool), createSchools(pool)]);
			}).then(function(done) {
				return Promise.all([createActivities(pool), createMenus(pool), createEmployees(pool), createContents(pool)]);
			}).then(function(done) {
				return createClasses(pool);
			}).then(function(done) {
				return Promise.all([createRooms(pool), createAgendasSections(pool)]);
			}).then(function (done) {
				return Promise.all([createDrafts(pool), createPosts(pool), createEvents(pool), createStudents(pool),  createAgendasSectionsRows(pool)]);
			}).then(function(done) {
				return Promise.all([createActivitiesClasses(pool), createClassesEducators(pool), createDraftsAuthors(pool), createDraftsProfiles(pool), createEducatorRooms(pool), createEventsConfirmations(pool), createGuardiansProfileStudents(pool), createPostsProfiles(pool), createPostsAuthors(pool), createPostsReads(pool), createSchoolsPedagogues(pool), createSchoolsEducators(pool), createSchoolsNutritionists(pool), createSchoolsCoordinators(pool)]);
			}).then(function(done) {
				return createFunctionModifiedTimestamp(pool);
			}).then(function(done) {
				return Promise.all([triggerTimestampAccounts(pool), triggerTimestampContents(pool), triggerTimestampProfiles(pool), triggerTimestampSchools(pool), triggerTimestampClasses(pool), triggerTimestampRooms(pool), triggerTimestampMenus(pool), triggerTimestampActivities(pool), triggerTimestampEvents(pool), triggerTimestampDrafts(pool), triggerTimestampPosts(pool), triggerTimestampCredentials(pool), triggerTimestampStudents(pool), triggerTimestampEmployees(pool)]);
			}).then(function(success) {
				resolve(success);
			})
			.catch(function(err) {
				reject(err);
			});
		});
	},
	pool: pool,
};

module.exports = db;
