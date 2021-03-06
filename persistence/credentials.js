/** @module persistence/credentials */

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/**
* @class
*/
var credentialServices = {
	/** @method logIn
	 * @description Create a new <tt>Credential</tt> or updates an existent one based on the user and the device
	 * @param device {Device}
	 * @param token {string}
	 * @param account {Account}
	 * @return Promise {Promise}
	 */
	logIn: function(device, token, account_id) {
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res, rej) {
						client.query('UPDATE credentials SET (token) = ($1) WHERE account = $2 AND device = $3', [token, account_id, device], function(err, result) {
							if (err) rej(err);
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else res(result);
						});
					});
				}).then(function(result) {
				   return new Promise(function (res, rej) {
					   if (result.rowCount === 0) { //No row was updated, meaning that we need to create one
						   client.query('INSERT INTO credentials (account, device, token) VALUES ($1, $2, $3)', [account_id, device, token], function(err, result) {
							   if (err) rej(err);
								 else if (result.name == "error") rej(result); //Some error occured : rejects
								 else res(result);
						   });
					   } else {
							 res(result);
						 } // A row was updated, credential is up to date!
				   });
				}).then(function(result) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve({token: token});
					}).catch(function(err) {
						done(err);
						reject(err);
					});
				}).catch(function(err) {
					return transaction.abort(client)
					.then(function() {
						done();
						reject(err);
					}).catch(function(err2) {
						done(err2);
						reject(err2);
					});
				});
			});
		});
	},
	/** @method read
	 *	@description Read a <tt>Credential</tt> provided a <tt>Token</tt>
	 *	@param token <Token>
	 *	@return credential <Credential>
	 */
	read: function(token) {
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT device, token FROM credentials WHERE token = $1 ', [token], function(err, result) {
					if (err) reject (err);
					else if (result.rowCount === 0) reject (result); //Reject here - will stop transaction
					else if (result.name == "error") reject (result); //Some error occured : rejects
					else resolve (result.rows[0]);
					done();
				});
			});
		});
	},
	
	/** @method logout
	 *	@description Read a <tt>Credential</tt> provided a <tt>Token</tt>
	 *	@param token <Token>
	 *	@return credential <Credential>
	 */
	logout: function(device, token) {
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('DELETE FROM credentials WHERE device = $1 AND token = $2', [device, token], function(err, result) {
					if (err) reject (err);
					else if (result.rowCount === 0) reject (result); //Reject here - will stop transaction
					else if (result.name == "error") reject (result); //Some error occured : rejects
					else resolve (result.rows[0]);
					done();
				});
			});
		});
	},
	
	updateNotification: function(active, awsID, device, rawToken) {
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res, rej) {
						client.query('UPDATE credentials SET (notifiable, notificationID) = (COALESCE($1, notifiable), COALESCE($2, notificationID)) WHERE token = $3 AND device = $4',[active, awsID, rawToken, device], function(err, result) {
							if (err) rej(err);
							else if (result.rowCount !== 1) rej(result); //Reject here - will stop transaction
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else res(result.rows[0]);
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
	},
	
	findNotificationIDForStudentsGuardians: function(student_profile_id) {
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT c.notificationID FROM credentials c, accounts a, profiles p, guardians_profile_students gps, students s WHERE s.id = gps.student AND gps.guardian_profile = p.id AND a.profile = p.id AND c.account = a.id AND s.profile = $1 AND c.notifiable = $2', [student_profile_id, true], function(err, result) {
					if (err) reject (err);
					else if (result.name == "error") reject (result); //Some error occured : rejects
					else resolve (result.rows);
					done();
				});
			});
		});
	},
};

module.exports = credentialServices;
