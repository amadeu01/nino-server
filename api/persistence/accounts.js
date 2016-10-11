/** @module persistence/accounts */

var accountsDAO = {};
var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/** @method createNewUser
 * @description Create a new <tt>Profile</tt> and links it to a new <tt>Account</tt>. Initiates transaction and creates new entities, linking them
 * @param account {Account}
 * @param profile {Profile}
 */
accountsDAO.createNewUser = function(account, profile) {
	return new Promise(function(resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			transaction.start(client)
			.then(function() {
				return new Promise(function(res, rej) {
					client.query('INSERT INTO profiles (name, surname, birthdate, gender) VALUES ($1, $2, $3, $4) RETURNING id', [profile.name, profile.surname, profile.birthdate, profile.gender], function(err, result) {
						if (err) rej (err);
						else if (result.name == 'error') rej(result); //Some error occured : rejects
						else res(result);
					});
				});
			}).then(function(result) {
				return new Promise(function(res, rej) {
					var response = {};
					response.profile = result.rows[0]; //Sets profile to response
					client.query('INSERT INTO accounts (profile, email, cellphone, hash) VALUES ($1, $2, $3, $4) RETURNING id', [result.rows[0].id, account.email, account.cellphone, account.hash], function(err, result) {
						if (err) rej (err);
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							//response.account = result.rows[0]; //Sets account to response
							res(response); //Sends account and profile in response dictionary
						}
					});
				});
			}).then(function(result) {
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

/** @method recoverAccount 
* @description Sets lost hash for account, making it possible to reset password 
* @param hash {string} hash to use when reseting password 
* @param password {string} new password 
* @param salt {string} salt of the password
* @return Promise {Promise} if successful, returns responde wih account information.
*/
accountsDAO.recoverAccount = function(hash, password, salt)  {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err); //Encaminha pro BO
				return;
			}
			transaction.start(client)
			.then(function() {
				return new Promise(function(res, rej) {
					client.query('UPDATE accounts SET (password, salt, passwordHash) = ($1, $2, $3) WHERE passwordHash = $4 RETURNING id, profile',[password, salt, undefined, hash], function(err, result) {
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
};

/** @method setLostAccount 
* @description Sets lost hash for account, making it possible to reset password 
* @param hash {string} hash to use when reseting password 
* @param email {string} email of the account to have the password reseted
* @return Promise {Promise} if successful, returns responde wih account information.
*/
accountsDAO.setLostAccount = function(email, hash) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err); //Encaminha pro BO
				return;
			}
			transaction.start(client)
			.then(function() {
				return new Promise(function(res, rej) {
					client.query('UPDATE accounts SET (passwordHash) = ($1) WHERE email = $2 RETURNING id, profile',[hash, email], function(err, result) {
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
};

/** @method confirmAccount
* @description find account with hash and applied true to <tt>account.confirmed</tt>.
* @param confirmationHash {string} hash when the model is created on the data.
* @return Promise {Promise} if successful, returns responde wih account information.
*/
accountsDAO.confirmAccount = function(confirmationHash, password, salt) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err); //Encaminha pro BO
				return;
			}
			transaction.start(client)
			.then(function() {
				return new Promise(function(res, rej) {
					client.query('UPDATE accounts SET (confirmed, password, salt) = ($1, $2, $3) WHERE hash = $4 RETURNING id, profile',[true, password, salt, confirmationHash], function(err, result) {
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
};

accountsDAO.getHash = function(email) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err); //Connection error, aborts already
				return;
			}
			client.query('SELECT hash FROM accounts WHERE email = $1', [email], function(err, result) {
				if (err) reject(err); //Error: rejects to BO
				else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				else if (result.name == "error") reject(result); //Some error occured : rejects
				else resolve(result.rows[0]); //Executed correctly
				done();
			});
		});
	});
}

/** @method findWithHash
 * @param confirmationHash {string}
 * @return account {Account}
 */
accountsDAO.findWithHash = function(confirmationHash) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err); //Connection error, aborts already
				return;
			}
			client.query('SELECT confirmed FROM accounts WHERE hash = $1', [confirmationHash], function(err, result) {
				if (err) reject(err); //Error: rejects to BO
				else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				else if (result.name == "error") reject(result); //Some error occured : rejects
				else resolve({account: result.rows[0]}); //Executed correctly
				done();
			});
		});
	});
};

/** @method logIn - A.K.A find validated with email
 * @param email {string}
 * @return Promise {Promise}
 */
accountsDAO.logIn = function(email) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('SELECT a.salt, a.email, a.password, a.cellphone, a.profile, a.id, p.name, p.surname, p.birthdate, p.gender FROM accounts a, profiles p WHERE a.profile = p.id AND a.email = $1 AND a.confirmed = $2', [email, true], function(err, result) {
				if (err) reject(err);
				else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				else if (result.name == "error") reject(result); //Some error occured : rejects
				else resolve(result.rows[0]); //Returns what was found
				done();
			});
		});
	});
};

/** @method logOut
* @param device {Device}
* @param token {string}
* @return Promise {Promise}
*/
accountsDAO.logOut = function(device, token) {
	return new Promise( function(resolve, reject) {

	});
};

/** @method logOut
* @param token {string}
* @return [Devices] {Array<Devices>}
*/
accountsDAO.getAccountDevices = function(token) {
	return new Promise( function(resolve, reject) {
		//i dont know
	});
};

accountsDAO.findOne = function (criteria) {
	//return new Promise (function(resolve, reject){
	//	criteria.active = true;
	//	transaction.start();
	//	return models.account.findOne(criteria).populate({'device'})
	//	.then(function(account){
	//		transaction.commit();
	//		resolve(new response(200, account));
	//	})
	//	.catch(function(err){
	//		transaction.abort();
	//		reject(err);
	//	});
	//});
};

module.exports = accountsDAO;
