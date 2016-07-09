/** @module persistence/employees */

var models = require('../models');
var errors = require('../mechanisms/error');
var validator = require('validator');
var employeesDAO = {};
var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/** @method createEducator
 * @description Create a new <tt>Profile</tt> and links it to a new <tt>Account</tt>. Creates a new <tt>Employee</tt> for specified school and link them,
 * @param account {Account}
 * @param profile {Profile}
 * @param school {School}
 * @return created items {id}
 */
employeesDAO.createEducator = function(account, profile, school) {
	return new Promise(function(resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			transaction.start(client)
			.then(function() { //Creates Profile
				return new Promise(function(res, rej) {
					client.query('INSERT INTO profiles (name, surname, birthdate, gender) VALUES ($1, $2, $3, $4) RETURNING id', [profile.name, profile.surname, profile.birthdate, profile.gender], function(err, result) {
						if (err) rej (err);
						else if (result.rowCount == 0) rej (result); //Reject here - will stop transaction
						else if (result.name == 'error') rej(result); //Some error occured : rejects
						else res(result);
					});
				});
			}).then(function(result) { //Creates Account
				return new Promise(function(res, rej) {
					var response = {}
					response.profile = result.rows[0]; //Sets profile to response
					client.query('INSERT INTO accounts (profile, email, cellphone, hash) VALUES ($1, $2, $3, $4) RETURNING id', [response.profile.id, account.email, account.cellphone, account.hash], function(err, result) {
						if (err) rej (err);
						else if (result.rowCount == 0) rej (result); //Reject here - will stop transaction
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							response.account = result.rows[0]; //Sets account to response
							res(response); //Sends account and profile in response dictionary
						}
					});
				});
			}).then(function(response) { //Create Employee
				return new Promise(function(res, rej) {
					client.query('INSERT INTO employees (profile, school) VALUES ($1, $2) RETURNING id', [response.profile.id, school.id], function(err, result) {
						if (err) rej (err);
						else if (result.rowCount == 0) rej (result); //Reject here - will stop transaction
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							response.employee = result.rows[0]; //Sets employee to response
							res(response); //Sends account and profile in response dictionary
						}
					});
				});
			}).then(function(response) { //Create SchoolEducators
				return new Promise(function(res, rej) {
					client.query('INSERT INTO schools_educators (school, educator) VALUES ($1, $2)', [school.id , response.employee.id], function(err, result) {
						if (err) rej (err);
						else if (result.rowCount == 0) rej (result); //Reject here - will stop transaction
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else res(response); //Sends account and profile in response dictionary
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


module.exports = employeesDAO;
