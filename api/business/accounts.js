var validator = require('validator');
var response = require('../mechanisms/response.js') ;

var accountsDAO = require('../persistence/accounts.js');

var business = {};


/* Create a new Profile and links it to a new Account
 * Validates required parameters and returns a promisse, calling the DAO to write to the DB
 */
business.createNewUser = function(account, profile){
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

module.exports = business;