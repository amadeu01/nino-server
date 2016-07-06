/** @module persistence/accounts */

var models = require('../models');
var errors = require('../mechanisms/error');
var validator = require('validator');
var guardiansDAO = {};
var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/** @method createNewUser
 * @description Create a new <tt>Profile</tt> and links it to a new <tt>Account</tt>. Initiates transaction and creates new entities, linking them
 * @param account {Account}
 * @param profile {Profile}
 */

guardiansDAO.create = function(profile, student) {
	return new Promise(function(resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			transaction.start(client)
			.then(function() { //Creates Profile
				return new Promise(function(res, rej) {
					var response = {}
					client.query('INSERT INTO profiles (name, surname, birthdate, gender) VALUES ($1, $2, $3, $4) RETURNING id', [profile.name, profile.surname, profile.birthdate, profile.gender], function(err, result) {
						if (err) rej (err);
						else if (result.rowCount == 0) rej (result); //Reject here - will stop transaction
						else if (result.name == 'error') rej(result); //Some error occured : rejects
						else {
							response.profile = result.rows[0]; //Sets profile to response
							res(response);
						}
					});
				});
			}).then(function(response) { //Create Guardian
				return new Promise(function(res, rej) {
					client.query('INSERT INTO guardians (profile) VALUES ($1) RETURNING id', [response.profile.id], function(err, result) {
						if (err) rej (err);
						else if (result.rowCount == 0) rej (result); //Reject here - will stop transaction
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							response.guardian = result.rows[0]; //Sets profile to response
							res(response); //Sends account and profile in response dictionary
						}
					});
				});
			}).then(function(response) { //Create Guardian to Student
				return new Promise(function(res, rej) {
					client.query('INSERT INTO guardians_students (guardian, student) VALUES ($1, $2)', [response.guardian.id, student.id], function(err, result) {
						if (err) rej (err);
						else if (result.rowCount == 0) rej (result); //Reject here - will stop transaction
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
}


module.exports = guardiansDAO;