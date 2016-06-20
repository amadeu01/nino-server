/** @module business */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var accountsDAO = require('../persistence/accounts.js');

/**
 * Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
 * @class
 */
var accounts = {};



/**
 * Create a new Profile and links it to a new Account
 * Validates required parameters and returns a promisse, calling the DAO to write to the DB
 * @param account
 * @param profile
 */
accounts.createNewUser = function(account, profile){
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) reject(new response(400),'email',1);
		//Keep validating parameters
		else {
			accountsDAO.createNewUser(account, profile)
			.then(function(response) {
				resolve(response);
			}).catch(function(error) {
				reject(error);
			});
		}
	});
}
/**
 * Confirm Account
 * Validates requires confirmationHash and Origin, cofirm User and clear hash.
 * @param confirmationHash
 * @param origin
 */
accounts.confirmAccount = function(confirmationHash, origin) {

}
/**
* Log In
* @param email
* @param password
* @param device
* @returns Token + Profile
*/
accounts.login = function() {

}

module.exports = accountsBusiness;
