/** @module business/accounts */

var validator = require('validator');
var errors = require('../mechanisms/error.js');
var response = require('../mechanisms/response.js');
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
		if (!validator.isEmail(account.email)) reject(errors.invalidParameters("email"));
		else if (!validator.isAlpha(profile.name, 'pt-PT')) reject(errors.invalidParameters("name"));
		else if (!validator.isAlpha(profile.surname, 'pt-PT')) reject(errors.invalidParameters("surname"));
		else {
			account.hash = uid.sync(100);
			return accountsDAO.createNewUser(account, profile)
			.then(function(newUser) {
				mail.sendUserConfirmation(account.email, {hash: account.hash});
				resolve(new response(200, newUser, null));
			}).catch(function(err) {
				//var data = err.message + " Create User error";
				reject(errors.internalError(err));
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
		if (!validator.isEmail(account.email)) reject(errors.invalidParameters("email"));
		else if (!validator.isAlpha(profile.name, 'pt-PT')) reject(errors.invalidParameters("name"));
		else if (!validator.isAlpha(profile.surname, 'pt-PT')) reject(errors.invalidParameters("surname"));
		else {
			account.hash = uid.sync(100);
			var hash = account.hash;
			return accountsDAO.createNewUser(account, profile)
			.then(function(newUser) {
				//console.log(hash);
				newUser.hash = hash;
				//mail.sendUserConfirmation(account.email, {hash: account.hash});
				resolve(new response(200, newUser, null));
			}).catch(function(err) {
				//var data = err.message + " Create User error";
				reject(errors.internalError(err));
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
			// TODO: check Ipad ?
			// TODO: if (!(userInfo.credentials.device === origin)) reject(new response(500, "extraneous device", 1));
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
					var res = {token: token};
					resolve(new response(200, res, null));
				}).catch(function(err) {
					reject(errors.internalError(err));
				});
			}).catch(function(err){
				reject(errors.internalError(err));
			});
		}).catch(function(err){
			//var data = "Confirm account error " + err.message;
			reject(errors.internalError(err));
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
			// TODO: check Ipad ?
			// TODO: if (!(userInfo.credentials.device === origin)) reject(new response(500, "extraneous device", 1));
			resolve(new response(200, userInfo, null));
		}).catch(function(err){
			//var data = "Confirm account error " + err.message;
			reject(errors.internalError(err));
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
		if (!validator.isEmail(email)) reject(errors.invalidParameters("email"));
		else {
			var tokenData = {
				device: device
			};

			return accountsDAO.logIn(email)
			.then(function(account) {
				// console.log("AccountsBO will print:");
				// console.log(account);
				tokenData.account = account.id;
				tokenData.profile = account.profile;
				return jwt.create(tokenData)
				.then(function(token) {
					return credentialDAO.logIn(device, token, account)
					.then(function(result) {
						//console.log("CredentialDAO Login res");
						//console.log(result);
						var res = {token: token};
						resolve(new response(200, res, null));
					});
				});
			}).catch(function(err){
				//var data = "Login error " + err.message;
				reject(errors.internalError(err));
			});
		}
	});
};

/** @method logout
* @param device {string}
* @param rawToken {string}
*/
accounts.logout = function(device, token) {
	return new Promise(function(resolve, reject) {
		//TODO: if (jwt.validate(token, device) === )
		return credentialDAO.logout(device, token)
		.then(function(response){
			resolve(new response(200, response, null));
		}).catch(function(err){
			//var data = "Logout error " + err.message;
			reject(errors.internalError(err));
		});
	});
};

module.exports = accounts;
