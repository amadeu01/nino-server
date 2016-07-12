/** @module persistence/students */

var models = require('../models');
var errors = require('../mechanisms/error');
var validator = require('validator');
var studentsDAO = {};
var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/** @method create
 * @description Create a new <tt>Profile</tt> with a <tt>Student</tt> and links them to a school and room
 * @param profile {Profile}
 * @param school {School}
 * @param room {Room}
 */

studentsDAO.create = function(profile, school, room) {
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
			}).then(function(response) { //Create Student
				return new Promise(function(res, rej) {
					client.query('INSERT INTO students (profile, school, room) VALUES ($1, $2, $3) RETURNING id', [response.profile.id, school.id, room.id], function(err, result) {
						if (err) rej (err);
						else if (result.rowCount == 0) rej (result); //Reject here - will stop transaction
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							response.student = result.rows[0];
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
			client.query('SELECT p.id, p.name, p.surname, p.birthdate, p.gender FROM profiles p, students s WHERE s.room = $1 AND s.profile = p.id', [roomID], function(err, result) {
				if (err) reject(err); //Error: rejects to BO
				else if (result.rowCount == 0) reject(result); //Nothing found, sends error
				else if (result.name == "error") reject(result); //Some error occured : rejects
				else resolve(result.rows); //Executed correctly
			});
		});
	});
}


module.exports = studentsDAO;
