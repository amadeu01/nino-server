/** @module business/accounts */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var accountsDAO = require('../persistence/accounts.js');
var credentialDAO = require('../persistence/credentials.js');
var jwt = require('../mechanisms/jwt.js');
var uid = require('uid-safe');
var mail = require('../mechanisms/mail.js');
var accounts = {};


/** @method createNewUser
 * @description Create a new Profile and links it to a new Account. Validates required parameters and returns a promisse, calling the DAO to write to the DB
 * @param account
 * @param profile
 * @param device {string} it defines from which plataform and os the request come from
 * @return promise {Promise} if it works it returns JSON with profile id and account id
 */
accounts.createNewUser = function(account, profile) {
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) resolve(responses.invalidParameters("email"));
		else if (!validator.isAlpha(profile.name, 'pt-PT')) resolve(responses.invalidParameters("name"));
		else if (!validator.isAlpha(profile.surname, 'pt-PT')) resolve(responses.invalidParameters("surname"));
		else {
			account.hash = uid.sync(100);
			return accountsDAO.createNewUser(account, profile)
			.then(function(newUser) {
				mail.sendUserConfirmation(account.email, {hash: account.hash});
				resolve(responses.success(newUser));
			}).catch(function(err) {
				resolve(responses.persistenceError(err));
			});
		}
	});
};

/** @method createNewUserTest
 * @description Create a new Profile and links it to a new Account. Validates required parameters and returns a promisse, calling the DAO to write to the DB. <p> This only for mocha test.
 * @param account
 * @param profile
 * @param device {string} it defines from which plataform and os the request come from
 * @return promise {Promise} if it works it returns JSON with profile id and account id, also returns hash
 */
accounts.createNewUserTest = function(account, profile) {
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) resolve(responses.invalidParameters("email"));
		else if (!validator.isAlpha(profile.name, 'pt-PT')) resolve(responses.invalidParameters("name"));
		else if (!validator.isAlpha(profile.surname, 'pt-PT')) resolve(responses.invalidParameters("surname"));
		else {
			account.hash = uid.sync(100);
			var hash = account.hash;
			return accountsDAO.createNewUser(account, profile)
			.then(function(newUser) {
				//console.log(hash);
				newUser.hash = hash;
				//mail.sendUserConfirmation(account.email, {hash: account.hash});
				resolve(responses.success(newUser));
			}).catch(function(err) {
				//var data = err.message + " Create User error";
				resolve(responses.persistenceError(err));
			});
		}
	});
};

/** @method confirmAccount
 * @description Validates requires confirmationHash and Origin, cofirm User and clear hash.
 * @param confirmationHash {string}
 * @param origin {string} it defines from which plataform and os the request come from
 */
accounts.confirmAccount = function(confirmationHash, device, password) {
	return new Promise(function(resolve, reject){
		return accountsDAO.confirmAccount(confirmationHash, password)
		.then(function(userInfo) {
			var tokenData = {
				profile: userInfo.profile,
				device: device,
				account: userInfo.id
			};
			return jwt.create(tokenData)
			.then(function(token) {
				return credentialDAO.logIn(device, token, account)
				.then(function(result) {
					var res = {token: token};
					resolve(responses.success(res));
				}).catch(function(err) {
					resolve(responses.persistenceError(err));
				});
			}).catch(function(err){
				resolve(responses.internalError(err));
			});
		}).catch(function(err){
			resolve(responses.persistenceError(err));
		});
	});
};

/** @method confirmAccountTest
 * @description Validates requires confirmationHash and Origin, cofirm User and clear hash.
 * @param confirmationHash {string}
 * @param origin {string} it defines from which plataform and os the request come from
 */
accounts.confirmAccountTest = function(confirmationHash, device, password) {
	return new Promise(function(resolve, reject){
		return accountsDAO.confirmAccount(confirmationHash, password)
		.then(function(userInfo) {
			var account = userInfo.account;
			var tokenData = {
				profile: userInfo.profile,
				device: device,
				account: account.id
			};
			return jwt.create(tokenData)
			.then(function(token) {
				return credentialDAO.logIn(device, token, account)
				.then(function(result) {
					var res = {
						rawToken: token,
						token: tokenData
					};
					resolve(responses.success(res));
				}).catch(function(err) {
					resolve(responses.persistenceError(err));
				});
			}).catch(function(err){
				resolve(responses.internalError(err));
			});
		}).catch(function(err){
			//var data = "Confirm account error " + err.message;
			resolve(responses.persistenceError(err));
		});
	});
};

/** @method findWithHash
 * @description Check if it's already confirmed
 * @param confirmationHash {string}
 * @param origin {string} it defines from which plataform and os the request come from
 */
accounts.findWithHash = function(confirmationHash) {
	return new Promise(function(resolve, reject){
		return accountsDAO.findWithHash(confirmationHash)
		.then(function(userInfo) {
			resolve(responses.success(userInfo));
		}).catch(function(err){
			resolve(responses.persistenceError(err));
		});
	});
};

/** @method logIn
* @param email {string}
* @param password {string}
* @param device
* @param populate {Array} tells which list must be populated
* @return Token {string}
* @return response {Promise} If successful, returns user id insede data
*/
accounts.logIn = function(email, password, device) {
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(email)) resolve(responses.invalidParameters("email"));
		else {
			var tokenData = {
				device: device
			};
			return accountsDAO.logIn(email)
			.then(function(account) {
				if (password !== account.password) {
					resolve(responses.inexistentRegister());
					return;
				}
				tokenData.account = account.id;
				tokenData.profile = account.profile;
				return jwt.create(tokenData)
				.then(function(token) {
					return credentialDAO.logIn(device, token, account)
					.then(function(result) {
						var res = {token: token};
						resolve(responses.success(res));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					})
				}).catch(function(err) {
					resolve(responses.internalError(err));
				});
			}).catch(function(err){
				resolve(responses.persistenceError(err));
			});
		}
	});
};

/** @method logIn
* @description Only for test sake
* @param email {string}
* @param password {string}
* @param device
* @param populate {Array} tells which list must be populated
* @return Token {string}
* @return response {Promise} If successful, returns user id insede data
*/
accounts.logInTest = function(email, password, device) {
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(email)) resolve(responses.invalidParameters("email"));
		else {
			var tokenData = {
				device: device
			};
			return accountsDAO.logIn(email)
			.then(function(account) {
				tokenData.account = account.id;
				tokenData.profile = account.profile;
				return jwt.create(tokenData)
				.then(function(token) {
					return credentialDAO.logIn(device, token, account)
					.then(function(result) {
						var res = {
							rawToken: token,
							token: tokenData,
							resTest: account
						};
						resolve(responses.success(res));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
				}).catch(function(err) {
					resolve(responses.internalError(err));
				});
			}).catch(function(err){
				resolve(responses.persistenceError(err));
			});
		}
	});
};

/** @method logout
* @param device {string}
* @param rawToken {string}
*/
accounts.logout = function(device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		return credentialDAO.logout(device, token)
		.then(function(response){
			resolve(responses.success(response));
		}).catch(function(err){
			resolve(responses.persistenceError(err));
		});
	});
};

module.exports = accounts;
