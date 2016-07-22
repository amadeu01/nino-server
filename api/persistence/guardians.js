/** @module persistence/guardians */

var guardiansDAO = {};
var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/** @method create
 * @description Create a new <tt>Profile</tt> and links it to a new <tt>Account</tt> and new <tt>Guardian</tt>, linking it to an existing <tt>Student</tt>
 * @param profile {Profile}
 * @param student {Student}
 * @param account {Account}
 * @return created IDs {id}
 */
guardiansDAO.create = function(account, profile, student_id) {
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
					client.query('INSERT INTO profiles (name, surname, birthdate, gender) VALUES ($1, $2, $3, $4) RETURNING id', [profile.name, profile.surname, profile.birthdate, profile.gender], function(err, result) {
						if (err) rej (err);
						else if (result.name == 'error') rej(result); //Some error occured : rejects
						else {
							response.profile = result.rows[0]; //Sets profile to response
							res(response);
						}
					});
				});
			}).then(function(response) { //Creates Account
				return new Promise(function(res, rej) {
					client.query('INSERT INTO accounts (profile, email, cellphone, hash) VALUES ($1, $2, $3, $4) RETURNING id', [response.profile.id, account.email, account.cellphone, account.hash], function(err, result) {
						if (err) rej (err);
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							response.account = result.rows[0]; //Sets account to response
							res(response); //Sends account and profile in response dictionary
						}
					});
				});
			}).then(function(response) { //Create Guardian
				return new Promise(function(res, rej) {
					client.query('INSERT INTO guardians (profile) VALUES ($1) RETURNING id', [response.profile.id], function(err, result) {
						if (err) rej (err);
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							response.guardian = result.rows[0]; //Sets profile to response
							res(response); //Sends account and profile in response dictionary
						}
					});
				});
			}).then(function(response) { //Create Guardian to Student
				return new Promise(function(res, rej) {
					client.query('INSERT INTO guardians_students (guardian, student) VALUES ($1, $2)', [response.guardian.id, student_id], function(err, result) {
						if (err) rej (err);
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
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

/** @method findWithProfileId
 * @description return guardian Information from Profile
 * @param id {id}
 * @return Promise {Promise}
 */
guardiansDAO.findWithProfileId = function(id) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('SELECT g.id FROM profiles p, guardians g WHERE g.profile = p.id AND p.id = $1', [id], function(err, result) {
				if (err) reject(err);
				else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				else if (result.name == "error") reject(result); //Some error occured : rejects
				else resolve(result.rows); //Returns what was found
				done();
			});
		});
	});
};

guardiansDAO.findWithSchoolAndStudentProfileAndGuardianProfile = function(school_id, student_profile_id, guardian_profile_id) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('SELECT g.id FROM schools sc, guardians g, students st, guardians_students gs WHERE sc.id = $1 AND st.profile = $2 AND g.profile = $3 AND st.school = sc.id AND gs.guardian = g.id AND gs.student = st.id', [school_id, student_profile_id, guardian_profile_id], function(err, result) {
				if (err) reject(err);
				else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				else if (result.name == "error") reject(result); //Some error occured : rejects
				else resolve(result.rows[0]); //Returns what was found
				done();
			});
		});
	});
};


module.exports = guardiansDAO;
