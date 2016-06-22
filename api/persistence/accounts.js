/** @module persistence/accounts */


var accountsDAO = {};

/** @method createNewUser
 * Create a new Profile and links it to a new Account
 * Initiates transaction and creates new entities, linking them
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
		//i dont know
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
*/
accountsDAO.logOut = function() {

}


module.exports = accountsDAO;
