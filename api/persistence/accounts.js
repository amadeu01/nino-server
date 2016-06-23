/** @module persistence/accounts */

var models = require('../models');
var errors = require('../mechanisms/errors');
var validator = require('validator');

var accountsDAO = {};

/** @method createNewUser
 * @description Create a new <tt>Profile</tt> and links it to a new <tt>Account</tt>. Initiates transaction and creates new entities, linking them
 * @param account {Account}
 * @param profile {Profile}
 */
accountsDAO.createNewUser = function(account, profile) {
	return new Promise(function(resolve, reject) {
		transaction.start(); //Starts DB transaction
		models.profile.create()//Creates first model
		.then(function(profile) {
			return models.account.create()
			.then(function(account) {
				transaction.commit(); //Everything ok, commits changes to database and returns success
				resolve(new response(200, profile.id));
			})
		})
		.catch(function(error) {
			transaction.abort(); //Error, discards changes and returns error
			reject(new error.internalError(error)); //
		});//Creates account
	});
}
/** @method confirmAccount
* @param confirmationHash {string} hash when the model is created on the data.
* @param orgin {string} comes on the body of the request
* @return Promise {Promise}
*/
accountsDAO.confirmAccount = function(confirmationHash, origin) {
	return new Promise(function(resolve, reject) {
		transaction.start(); //Starts DB transaction
		
		transaction.commit();
		resolve(new response(200));

	});
}
/** @method recoverAccount
* @param email {string}
* @return Promise {Promise}
*/
accountsDAO.recoverAccount = function(email) {
 return new Promise(function (resolve, reject) {
	 transaction.start();
	 transaction.commit();
	 resolve(new response(200)); //success
 });
}

/** @method logOut
* @param device {Device}
* @param token {string}
* @return Promise {Promise}
*/
accountsDAO.logOut = function(device, token) {
	return new Promise( function(resolve, reject) {

	});
}

/** @method logOut
* @param token {string}
* @return [Devices] {Array<Devices>}
*/
accountsDAO.getAccountDevices = function() {
	return new Promise( function(resolve, reject) {

	});
}

module.exports = accountsDAO;
