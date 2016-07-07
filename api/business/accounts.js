/** @module business/accounts */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var accountsDAO = require('../persistence/accounts.js');
var credentialDAO = require('../persistence/credentials.js');
var jwt = require('../mechanisms/jwt.js')
var uid = require('uid-safe');
var mail = require('../mechanisms/mail.js')
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
		if (!validator.isEmail(account.email)) reject(new response(400,'email',1));
		else if (!validator.isAlpha(profile.name, 'pt-PT')) reject(new response (400, 'name', 1));
		else if (!validator.isAlpha(profile.surname, 'pt-PT')) reject(new response (400, 'surname', 1));
		else {
			account.hash = uid.sync(100);
			return accountsDAO.createNewUser(account, profile)
			.then(function(newUser) {
				mail.sendUserConfirmation(account.email, {hash: account.hash});
				resolve(newUser);
			}).catch(function(err) {
				var data = err.message + " Create User error";
				reject(new response(400, data, 1));
			});
		}
	});
}

/** @method confirmAccount
 * @description Validates requires confirmationHash and Origin, cofirm User and clear hash.
 * @param confirmationHash {string}
 * @param origin {string} it defines from which plataform and os the request come from
 */
accounts.confirmAccount = function(confirmationHash, origin, password) {
	return new Promise(function(resolve, reject){
		return accountsDAO.confirmAccount(confirmationHash, password)
		.then(function(userInfo) {
			// TODO: check Ipad ?
			if (!(userInfo.credentials.device === origin)) reject(new response(500, "Wrong device", 1));
			resolve(userInfo);
		}).catch(function(err){
			var data = "Confirm account error " + err.message;
			reject(new response(400, data, 1));
		});
	});
}

/** @method login
* @param email {string}
* @param password {string}
* @param device
* @param populate {Array} tells which list must be populated
* @return Token {string}
* @return promise {Promise} If successful, returns user id
*/
accounts.login = function(email, password, device, populate) {
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) reject(new response(400,'email',1));
		else {
			var tokenData = {
			email: email,
			device: device
		};

		return accountsDAO.login(email)
		.then(function(account) {
			return jwt.create(tokenData)
			.then(function(token) {
				return credentialDAO.logIn(device, token, account)
				.then(function(result) {
					resolve(result);
				});
			});
		}).catch(function(err){
			var data = "Login error " + err.message;
			reject(new response(400, data, 1));
		});
	}
});
}

/** @method logout
* @param device
* @param token
*/
accounts.logout = function(device, token) {
	return new Promise(function(resolve, reject) {
		//TODO: if (jwt.validate(token, device) === )
		return credentialDAO.logout(device, token)
		.then(function(response){
			resolve(response)
		}).catch(function(err){
			var data = "Logout error " + err.message;
			reject(new response(400, data, 1));
		});
	});
}

module.exports = accounts;
