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
 */
accounts.createNewUser = function(account, profile){
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) reject(new response(400,'email',1));
		else if (name.isAlpha(account.name, 'pt-PT')) reject(new response (400, 'name', 1));
		else if (name.isAlpha(account.surname, 'pt-PT')) reject(new response (400, 'name', 1));
		else {
			account.hash = values.confirmationUID = uid.sync(100);
			return accountsDAO.createNewUser(account, profile)
			.then(function(newUser) {
				mail.sendUserConfirmation(newUser.email, newUser.profile);
				resolve(newUser.id);
			}).catch(function(err) {
				reject(err);
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
		return accountsDAO.confirmAccount(confirmationHash, password);
	})
	.then(function(userInfo) {
		//TODO: check origin ?
		resolve(userInfo);
	}).catch(function(err){
		reject(err);
	});
}
/** @method login
* @param email {string}
* @param password {string}
* @param device
* @param populate {Array} tells which list must be populated
* @return Token {string}
* @return Profile {id}
*/
accounts.login = function(email, password, device, populate) {
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) reject(new response(400,'email',1));
		else {
			tokenData = {
			email: email,
			device: device
		}
		return accountsDAO.login(email)
		.then(function(account) {
			jwt.create(tokenData)
			.then(function(token) {
				credentialDAO.logIn(device, account, token)
				.then(function(result){
					//Idon't know where i expect here.
					resolve(result);
				})
			})
		}).catch(function(err){
			reject(err);
		});
	}
}
}
/** @method logout
* @param device
* @param token
*/
accounts.logout = function(device, token) {
	return new Promise(function(resolve, reject) {
		return credentialDAO.logout(device, token)
		.then(function(response){
			resolve(response)
		}).catch(function(err){
			reject(err);
		});
	});
}

module.exports = accounts;
