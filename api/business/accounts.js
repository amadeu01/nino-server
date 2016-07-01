/** @module business/accounts */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var accountsDAO = require('../persistence/accounts.js');
var jwt = require('../mechanisms/jwt.js')
var accounts = {};


/** @method createNewUser
 * @description Create a new Profile and links it to a new Account. Validates required parameters and returns a promisse, calling the DAO to write to the DB
 * @param account
 * @param profile
 */
accounts.createNewUser = function(account, profile){
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) reject(new response(400),'email',1);
		//Keep validating parameters
		else {
			return accountsDAO.createNewUser(account, profile)
			.then(function(response) {
				resolve(response);
			}).catch(function(err) {
				reject(err);
			});
		}
	});
}
/** @method confirmAccount
 * @description Validates requires confirmationHash and Origin, cofirm User and clear hash.
 * @param confirmationHash {string}
 * @param origin {json} JSON with information about origin of data.
 */
accounts.confirmAccount = function(confirmationHash, origin) {
	return new Promise(function(resolve, reject){
		if (origin.isMobile === true ) { //it could be any other validation
			reject(new response(400), 'mobile', 1); // i dont know what i'm doing here, must be changed
		}
		return accountsDAO.confirmAccount(confirmationHash)
		.then(function (account) {

		})
		.catch(function (err) {
			reject(err)
		});
	});
}
/** @method login
* @param email {string}
* @param password {string}
* @param device
* @param populateEmployee {bool}
* @param populateStudent {bool}
* @param populateGuardian {bool}
* @return Token {string}
* @return Profile {id}
*/
accounts.login = function(email, password, device) {
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) reject(new response(400),'email',1);
		else {
			transaction.start();
			tokenData = {
				email: email,
				password: password,
				device: device
			}
			return accountsDAO.findOne({email: email, password: password})
			.then(function (user) {
				transaction.commit();
				resolve(user.id, user.credential.token);
			})
			.catch(function(err){
				transaction.abort();
				reject(err);
			});
		}
	});
}

module.exports = accounts;
