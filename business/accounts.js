/** @module business/accounts */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var accountsDAO = require('../persistence/accounts.js');
var credentialDAO = require('../persistence/credentials.js');
var jwt = require('../mechanisms/jwt.js');
var uid = require('uid-safe');
// var mail = require('../mechanisms/mail.js');
var accounts = {};
var ninoCrypto = require("../mechanisms/crypto.js");
var sns = require("../mechanisms/AWSSNS.js");


/** @method createNewUser
 * @description Create a new Profile and links it to a new Account. Validates required parameters and returns a promisse, calling the DAO to write to the DB
 * @param account
 * @param profile
 * @param device {string} it defines from which plataform and os the request come from
 * @return promise {Promise} if it works it returns JSON with profile id and account id
 */
accounts.createNewUser = function(account, profile) {
	return new Promise(function(resolve, reject) {
		var invalidParameters = [];
		if (!validator.isEmail(account.email)) invalidParameters.push("email");
		else if (invalidParameters.length > 0) resolve(responses.missingParameters(invalidParameters));
		else {
			account.hash = uid.sync(100);
			return accountsDAO.createNewUser(account, profile)
			.then(function(newUser) {
				// mail.sendUserConfirmation(account.email, {hash: account.hash});
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
		var invalidParameters = [];
		if (!validator.isEmail(account.email)) invalidParameters.push("email");
		if (!validator.isAlpha(profile.name, 'pt-PT')) invalidParameters.push("name");
		if (!validator.isAlpha(profile.surname, 'pt-PT')) invalidParameters.push("surname");
		else if (invalidParameters.length > 0) reject(responses.missingParameters(invalidParameters));
		else {
			account.hash = uid.sync(100);
			var hash = account.hash;
			return accountsDAO.createNewUser(account, profile)
			.then(function(newUser) {
				//console.log(profile);
				newUser.hash = hash;
				//console.log(newUser);
				//mail.sendUserConfirmation(account.email, {hash: account.hash});
				resolve(responses.success(newUser));
			}).catch(function(err) {
				//console.log(err);
				resolve(responses.persistenceError(err));
			});
		}
	});
};

/** @method recoverAccount
 * @description Validates requires confirmationHash and Origin, cofirm User and clear hash.
 * @param hash {string}
 * @param device {string} it defines from which plataform and os the request come from
 * @param password {string}
 */
accounts.recoverAccount = function(hash, device, password) {
	return new Promise(function(resolve, reject) {
		if (hash === null || hash === undefined) reject(responses.missingParameters('hash'));
		else if (password.length < 8) resolve(responses.invalidParameters("password_len"));
		else {
			var splited = hash.split('-');
			var timestamp = splited[splited.length - 1];
			var now = new Date().getTime();

			if (now - timestamp < 86400000) { //Check if more than one day has passed
				var salt = ninoCrypto.createSalt();
				password = ninoCrypto.hash(password, salt);
				return accountsDAO.recoverAccount(hash, password, salt)
				.then(function(userInfo) {
					var tokenData = {
						profile: userInfo.profile,
						device: device,
						account: userInfo.id
					};
					return jwt.create(tokenData)
					.then(function(token) {
						return credentialDAO.logIn(device, token, userInfo.id)
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
			} else resolve(responses.invalidParameters("hash_timeout"));
		}
	});
};

/** @method setLostAccount
 * @description Validates requires confirmationHash and Origin, cofirm User and clear hash.
 * @param hash {string}
 * @param device {string} it defines from which plataform and os the request come from
 * @param password {string}
 */
accounts.setLostAccount = function(email, device) {
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(email)) resolve(responses.invalidParameters("email"));
		else {
			var hash = uid.sync(100);
			var now = new Date().getTime();
			var nHash = hash + '-' + now;
			return accountsDAO.setLostAccount(email, nHash)
			.then(function(account) {
				// mail.sendUserRecover(email, {hash: nHash});
				resolve(responses.success());
			}).catch(function(err) {
				if (err.rowCount === 0) {
					resolve(responses.inexistentRegister());
				} else {
					resolve(responses.persistenceError(err));
				}
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
		if (password.length < 8) resolve(responses.invalidParameters("password_len"));
		else {
			var salt = ninoCrypto.createSalt();
			password = ninoCrypto.hash(password, salt);
			return accountsDAO.confirmAccount(confirmationHash, password, salt)
			.then(function(userInfo) {
				var tokenData = {
					profile: userInfo.profile,
					device: device,
					account: userInfo.id
				};
				return jwt.create(tokenData)
				.then(function(token) {
					return credentialDAO.logIn(device, token, userInfo.id)
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
		}
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
			var tokenData = {
				profile: userInfo.profile,
				device: device,
				account: userInfo.id
			};
			return jwt.create(tokenData)
			.then(function(token) {
				return credentialDAO.logIn(device, token, userInfo.id)
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
				var hashed = ninoCrypto.hash(password, account.salt);
				if (!ninoCrypto.slowCompare(hashed, account.password)) {
					resolve(responses.inexistentRegister());
					return;
				}
				tokenData.account = account.id;
				tokenData.profile = account.profile;
				return jwt.create(tokenData)
				.then(function(token) {
					return credentialDAO.logIn(device, token, account.id)
					.then(function(result) {
						var res = {token: token};
						resolve(responses.success(res));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
				}).catch(function(err) {
					resolve(responses.internalError());
				});
			}).catch(function(err){
				resolve(responses.inexistentRegister());
			});
		}
	});
};

/** @method logInTest
* @description Only for test sake
* @param email {string}
* @param password {string}
* @param device
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
					return credentialDAO.logIn(device, token, account.id)
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

accounts.updateNotifications = function(deviceToken, device, rawToken, token, isiOS, isAndroid, host) {
	return new Promise(function(resolve, reject) {
		if (deviceToken) {
			if (isiOS) {
				if (host === "development.ninoapp.com.br:5000") {
					sns.createDevPlatformEndpoint(deviceToken)
					.then(function(snsID) {
						credentialDAO.updateNotification(true, snsID.EndpointArn, device, rawToken)
						.then(function(response){
							resolve(responses.success(response));
						}).catch(function(err){
							resolve(responses.persistenceError(err));
						});
					}).catch(function(err) {
						resolve(responses.internalError(err));
					});
				}
			}
		} else {
			credentialDAO.updateNotification(false, null, device, rawToken)
			.then(function(response){
				resolve(responses.success(response));
			}).catch(function(err){
				resolve(responses.persistenceError(err));
			});
		}
	});
};

module.exports = accounts;
