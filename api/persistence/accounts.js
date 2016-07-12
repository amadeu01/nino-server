/** @module persistence/accounts */

var models = require('../models');
var errors = require('../mechanisms/error');
var validator = require('validator');
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
						else if (result.rowCount === 0) rej (result); //Reject here - will stop transaction
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
						else if (result.rowCount === 0) rej (result); //Reject here - will stop transaction
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							response.account = result.rows[0]; //Sets account to response
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
/** @method confirmAccount
* @description find account with hash and applied true to <tt>account.confirmed</tt>.
* @param confirmationHash {string} hash when the model is created on the data.
* @return Promise {Promise} if successful, returns responde wih account information.
*/
accountsDAO.confirmAccount = function(confirmationHash, password) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err); //Encaminha pro BO
				return;
			}
			transaction.start(client)
			.then(function() {
				var response = {};
				return new Promise(function(res, rej) {
					client.query('UPDATE accounts SET (confirmed, password) = ($1, $2) WHERE hash = $3 RETURNING id, profile, email',[true, password, confirmationHash], function(err, result) {
						if (err) rej(err);
						else if (result.rowCount === 0) rej(result); //Reject here - will stop transaction
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							response.account = {
								id: result.rows[0].id,
								email: result.rows[0].email
							};
							response.profile = result.rows[0].profile;
							res(response);
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
/** @method recoverAccount
* @param email {string}
* @return Promise {Promise}
*/
accountsDAO.recoverAccount = function(email) {
 //return new Promise(function (resolve, reject) {
 //	 transaction.start();
 //	 transaction.commit();
 //	 resolve(new response(200)); //success
 //});
};

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
			client.query('SELECT a.email, a.password, a.cellphone, p.name, p.surname, p.birthdate, p.gender FROM accounts a, profiles p WHERE a.profile = p.id AND a.email = $1 AND a.confirmed = $2', [email, true], function(err, result) {
				if (err) reject(err);
				else if (result.rowCount === 0) rej(result); //Nothing found, sends error
				else if (result.name == "error") rej(result); //Some error occured : rejects
				else resolve(result.rows[0]); //Returns what was found
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
