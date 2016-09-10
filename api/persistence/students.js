/** @module persistence/students */

var studentsDAO = {};
var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/** @method create
 * @description Create a new <tt>Profile</tt> with a <tt>Student</tt> and links them to a school and room
 * @param profile {Profile}
 * @param school {School}
 * @param room {Room}
 */

studentsDAO.create = function(profile, school_id, room_id) {
	return new Promise(function(resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			transaction.start(client)
			.then(function() { //Creates Profile
				return new Promise(function(res, rej) {
					var response = {};
					client.query('INSERT INTO profiles (name, surname, birthdate, gender) VALUES ($1, $2, $3, $4) RETURNING id, createdAt', [profile.name, profile.surname, profile.birthdate, profile.gender], function(err, result) {
						if (err) rej (err);
						else if (result.name == 'error') rej(result); //Some error occured : rejects
						else {
							response.profile = result.rows[0]; //Sets profile to response
							res(response);
						}
					});
				});
			}).then(function(response) { //Create Student
				return new Promise(function(res, rej) {
					client.query('INSERT INTO students (profile, school, room) VALUES ($1, $2, $3) RETURNING id', [response.profile.id, school_id, room_id], function(err, result) {
						if (err) rej (err);
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							//response.student = result.rows[0];
							res(response); //Sends account and profile in response dictionary
						}
					});
				});
			}).then(function(result) { //End
				return transaction.commit(client)
				.then(function() {
					done();
					resolve(result); //Success! Resolve to BO
				}).catch(function(err) {
					done(err);
					reject(err); //Reject other to BO
				});
			}).catch(function (err) {
				return transaction.abort(client)
				.then(function() {
					done();
					reject(err); //Successfully aborted, rejects to BO
				}).catch(function(err2) {
					done(err2);
					reject(err2); // Reject another error to BO
				});
			});
		});
	});
};

/** @method findWithRoomId
 * @description Finds all students of a room
 * @param roomID {Int}
 * @return List of rooms {Array<Room>}
 */

studentsDAO.findWithRoomId = function(roomID) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err); //Connection error, aborts already
				return;
			}
			client.query('SELECT p.id, p.name, p.surname, p.birthdate, p.gender, p.createdAt FROM profiles p, students s WHERE s.room = $1 AND s.profile = p.id', [roomID], function(err, result) {
				if (err) reject(err); //Error: rejects to BO
				else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				else if (result.name == "error") reject(result); //Some error occured : rejects
				else resolve(result.rows); //Executed correctly
				done();
			});
		});
	});
};

/** @method findWithGuardianId
 * @description Find all students for a guardian
 * @param guardian_id {id}
 * @return student {Array<Student>}
 */
 studentsDAO.findWithGuardianProfileId = function(guardian_profile_id) {
	 return new Promise(function (resolve, reject) {
		 pool.connect(function(err, client, done) {
			 if (err) {
				 reject(err); //Connection error, aborts already
				 return;
			 }
			 client.query('SELECT p.id, p.name, p.surname, p.birthdate, p.gender, s.school, p.createdAt, s.room FROM profiles p, students s, guardians_profile_students gs WHERE gs.guardian_profile = $1 AND gs.student = s.id AND p.id = s.profile', [guardian_profile_id], function(err, result) {
				 if (err) reject(err); //Error: rejects to BO
				 else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				 else if (result.name == "error") reject(result); //Some error occured : rejects
				 else resolve(result.rows); //Executed correctly
				 done();
			 });
		 });
	 });
 };
 /** @method findWithProfileId
  * @description Find all students for a guardian
  * @param class_id {id}
  * @return class array {Array<Class>}
  */
  studentsDAO.findWithProfileId = function(profile_id) {
 	 return new Promise(function (resolve, reject) {
 		 pool.connect(function(err, client, done) {
 			 if (err) {
 				 reject(err); //Connection error, aborts already
 				 return;
 			 }
 			 client.query('SELECT s.id, s.school, s.room, p.createdAt FROM profiles p, students s WHERE p.id = $1 AND p.id = s.profile', [profile_id], function(err, result) {
 				 if (err) reject(err); //Error: rejects to BO
 				 else if (result.rowCount === 0) reject(result); //Nothing found, sends error
 				 else if (result.name == "error") reject(result); //Some error occured : rejects
 				 else resolve(result.rows[0]); //Executed correctly
 				 done();
 			 });
 		 });
 	 });
  };
	/** @method findWithGuardianProfileAndStudentProfile
  * @description Validate student to school
  * @param guardian_profile_id {id}
  * @param student_profile_id {id}
  * @return student {id}
  */
 studentsDAO.findWithGuardianProfileAndStudentProfile = function(guardian_profile_id, student_profile_id) {
	 return new Promise(function (resolve, reject) {
		 pool.connect(function(err, client, done) {
			 if (err) {
				 reject(err); //Connection error, aborts already
				 return;
			 }
			 client.query('SELECT s.id FROM students s, guardians_profile_students gs WHERE gs.guardian_profile = $1 AND gs.student = s.id AND s.profile = $2', [guardian_profile_id, student_profile_id], function(err, result) {
				 if (err) reject(err); //Error: rejects to BO
				 else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				 else if (result.name == "error") reject(result); //Some error occured : rejects
				 else resolve(result.rows[0]); //Executed correctly
				 done();
			 });
		 });
	 });
 };
 /** @method findWithSchoolAndStudentProfile
 * @description Validate student to school
 * @param school_id {id}
 * @param student_profile_id {id}
 * @return student {id}
 */
 studentsDAO.findWithSchoolAndStudentProfile = function(school_id, profile_id) {
	 return new Promise(function (resolve, reject) {
		 pool.connect(function(err, client, done) {
			 if (err) {
				 reject(err); //Connection error, aborts already
				 return;
			 }
			 client.query('SELECT s.id, p.createdAt FROM students s, profiles p WHERE s.school = $1 AND s.profile = p.id AND p.id = $2', [school_id, profile_id], function(err, result) {
				 if (err) reject(err); //Error: rejects to BO
				 else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				 else if (result.name == "error") reject(result); //Some error occured : rejects
				 else resolve(result.rows[0]); //Executed correctly
				 done();
			 });
		 });
	 });
 };
 /** @method findWithSchoolAndGuardianProfile
 * @param school_id {id}
 * @param guardian_profile_id {id}
 * @return guardian {Array<Students>}
 */
 studentsDAO.findWithSchoolAndGuardianProfile = function(school_id, guardian_profile_id) {
	 return new Promise(function (resolve, reject) {
		 pool.connect(function(err, client, done) {
			 if (err) {
				 reject(err); //Connection error, aborts already
				 return;
			 }
			 client.query('SELECT p.id, p.name, p.surname, p.birthdate, p.gender, s.school, s.room, p.createdAt FROM profiles p, students s, guardians_profile_students gs WHERE gs.guardian_profile = $1 AND gs.student = s.id AND p.id = s.profile AND s.school = $2', [guardian_profile_id, school_id], function(err, result) {
				 if (err) reject(err); //Error: rejects to BO
				 else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				 else if (result.name == "error") reject(result); //Some error occured : rejects
				 else resolve(result.rows); //Executed correctly
				 done();
			 });
		 });
	 });
 };
 
 /** @method findWithEmployeeProfileAndStudentProfile
 * @param employee_profile_id {id}
 * @param student_profile_id {id}
 * @return Student {Array<Students>}
 */
 studentsDAO.findWithEmployeeProfileAndStudentProfile = function(employee_profile_id, student_profile_id) {
	 return new Promise(function (resolve, reject) {
		 pool.connect(function(err, client, done) {
			 if (err) {
				 reject(err); //Connection error, aborts already
				 return;
			 }
			 client.query('SELECT s.id, p.createdAt FROM students s, profiles p, employees e WHERE e.profile = $1 AND s.profile = $2 AND e.school = s.school', [employee_profile_id, student_profile_id], function(err, result) {
				 if (err) reject(err); //Error: rejects to BO
				 else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				 else if (result.name == "error") reject(result); //Some error occured : rejects
				 else resolve(result.rows[0]); //Executed correctly
				 done();
			 });
		 });
	 });
 };

 studentsDAO.removeStudentFromGuardianProfile = function(student_id, guardian_profile_id) {
	 return new Promise(function (resolve, reject) {
		 pool.connect(function(err, client, done) {
			 if (err) {
				 reject(err); //Connection error, aborts already
				 return;
			 }
			 client.query('DELETE FROM guardians_profile_students WHERE guardian_profile = $1 AND student = $2', [guardian_profile_id, student_id], function(err, result) {
				 if (err) reject(err); //Error: rejects to BO
				 else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				 else if (result.name == "error") reject(result); //Some error occured : rejects
				 else resolve(result.rows[0]); //Executed correctly
				 done();
			 });
		 });
	 });
 }

module.exports = studentsDAO;
