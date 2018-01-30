/** @module persistence/profiles */

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/**
* @class
*/
var profileServices = {
	/** @method findWithId
	* @param profile_id {id}
	*/
	findWithId: function(id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT id, name, surname, birthdate, gender FROM profiles WHERE id = $1', [id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows[0]); //Executed correctly
					done();
				});
			});
		});
	},

	update: function(profile_id, profile) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Encaminha pro BO
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res, rej) {
						client.query('UPDATE profiles SET (name, surname, birthdate, gender) = (COALESCE($1, name), COALESCE($2, surname), COALESCE($3, birthdate), COALESCE($4, gender)) WHERE id = $5 RETURNING id',[profile.name, profile.surname, profile.birthdate, profile.gender, profile_id], function(err, result) {
							if (err) rej(err);
							else if (result.rowCount === 0) rej(result); //Reject here - will stop transaction
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else {
								res(result.rows[0]);
							} //Updated one row, user confirmed! - proceed
						});
					});
				}).then(function(result) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve(result); //Ended transaction and resolved to BO
					}).catch(function(err) {
						done(err);
						reject(err); //Error on transaction, reject to BO
					});
				}).catch(function(err) {
					return transaction.abort(client)
					.then(function() {
						done();
						reject(err); //Reject error to BO
					}).catch(function(err2) {
						done(err2);
						reject(err2); //Reject other error to BO
					});
				});
			});
		});	
	}
};

module.exports = profileServices;
