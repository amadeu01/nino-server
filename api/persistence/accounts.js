var transaction = require('../mechanisms/transaction');
var models = require('../models');
var response = require('../mechanisms/response');
var error = require('../mechanisms/error');

var DAO = {};

/* Create a new Profile and links it to a new Account
 * Initiates transaction and creates new entities, linking them
 */
DAO.createNewUser = function(account, profile) {
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

module.exports = DAO;