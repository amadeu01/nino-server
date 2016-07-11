/** @module persistence/credentials */

var models = require('../models');
var errors = require('../mechanisms/error');
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
	logIn: function(device, token, account) {
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res, rej) {
						client.query('UPDATE credentials SET (token) = ($1) WHERE account = $2 AND device = $3', [token, account.id, device], function(err, result) {
							if (err) rej(err);
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else res(result);
						});
					});
				}).then(function(result) {
				   return new Promise(function (res, rej) {
					   if (result.rowCount === 0) { //No row was updated, meaning that we need to create one
						   client.query('INSERT INTO credentials (account, device, token) VALUES ($1, $2, $3)', [account.id, device, token], function(err, result) {
							   if (err) rej(err);
		 						else if (result.rowCount === 0) rej (result); //Reject here - will stop transaction
		 						else if (result.name == "error") rej(result); //Some error occured : rejects
							   else res(result);
						   });
					   } else res(result); // A row was updated, credential is up to date!
				   });
				}).then(function(result) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve();
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
	delete: function(token) {
		return models.waterline.collections.credential.destroy({token: token});
	},
	update: function(token, newToken) {
		return models.waterline.collections.credential.update({token: token}, {token: newToken});
	},
	/** @method read
	 *	@description Read a <tt>Credential</tt> provided a <tt>Token</tt>
	 *	@param token <Token>
	 *	@return credential <Credential>
	 */
	read: function(token) {
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, dont) {
				if (err) {
					reject(err);
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res, rej) {
						client.query('SELECT device, token FROM credentials WHERE token = $1 ', [token], function(err, result) {
							if (err) rej(err);
							else res(result);
						});
					});
				}).then(function(result) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve(result);
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
						reject(err);
					});
				});
			});
		});
	},
	loginEducator: function(email, password, device) {
		return models.waterline.collections.user.findOne({email: email}).populate('roles', {
			where: {
				type: 'educator'
			}
		})
		.then(function(user) {
			if (user.password !== password) {
				throw(errors.invalidParameters('Incorrect username or password'));
			} else if (user.roles.length === 0) {
				throw(errors.inexistentRegister('Inexistent role for user'));
			} else if (user.roles.length !== 1) {
				throw(errors.invalidParameters(user.roles));
			} else {
				return jwt.create({user: user.id, role: user.roles[0].id})
				.then(function(token) {
					return models.waterline.collections.device.findOrCreate({description:device}, {description:device, owner: user.id})
					.then(function(device) {
						device.credentials.add({token: token, active: true});
						return device.save()
						.then(function() {
							return {token: token};
						});
					});
				});
			}
		});
	}
};

module.exports = credentialServices;
