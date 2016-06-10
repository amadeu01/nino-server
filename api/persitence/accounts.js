var transaction = require('../mechanisms/transaction.js');
var models = require('../models');

var DAO;

/* Create a new Profile and links it to a new Account
 * Initiates transaction and creates new entities, linking them
 */
DAO.createNewUser = function(account, profile) {
	return new Promise(function(resolve, reject) {
		transaction.start(); //Starts DB transaction
		models.profile.create()//Creates first model
		.then() {
			return models.account.create()
		}.then() {
			transaction.commit(); //Everything ok, commits changes to database and returns success
			resolve(new response(400),'email',1));
		}.catch() {
			transaction.abort(); //Error, discards changes and returns error
			reject(new response(400),'email',1)); //
		};//Creates account
	});
}

module.exports = DAO;