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
 * @param device {string} it defines from which plataform and os the request come from
 */
accounts.createNewUser = function(account, profile, device){
	return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) reject(new response(400,'email',1));
		else if (name.isAlpha(account.name, 'pt-PT')) reject(new response (400, 'name', 1));
		else if (name.isAlpha(account.surname, 'pt-PT')) reject(new response (400, 'name', 1));
		else {
			//TODO: token não é gerado mais aqui
			//TODO: Gerar um hash de confirmação para passar para o accountsDAO.createNewUser dentro de account
			//TODO: Enviar um email com hash de convirmação
			var token = jwt.create({email: account.email, password: account.password, device: device});
			var credential = {
				device: device,
				token: token
			}
			//TODO: accountsDAO.createNewUser nao recebe mais uma credential
			return accountsDAO.createNewUser(account, profile, credential)
			.then(function(newUser) {
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
accounts.confirmAccount = function(confirmationHash, origin) {
	return new Promise(function(resolve, reject){
		//TODO: o accountsDAO tem um metodo confirmAccount agora, da uma olhada lá :) ele já faz tudo, acha conta com o hash, confirma e seta o email, botando o hash pra null
		return accountsDAO.findOne(confirmationHash)
		.then(function (userAccount) {
			return accountsDAO.update({id: userAccount.id}, {hash: null})
			.then(function(userAccount){
				resolve("Success")
			}).catch(function(err){
				var data = err.message + " Problem to confirm Account ";
				reject(new response(400, data, 1));
			})
		});
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
		if (!validator.isEmail(account.email)) reject(new response(400),'email',1);
		else {
			tokenData = {
				email: email,
				password: password, //TODO: o token não tem a senha naaaaaao D: hahahaha se não a gente expoe a senha do cara!
				device: device
			}
			//TODO: não precisa do findOne, eu fiz um metodo no accountsDAO e um  no credentialsDAO, o do acocunts pega um usuario com aquele email e o do credentials salva a credencial :) olha lá
			return accountsDAO.findOne({email: email, password: password}).populate(populate)
			.then(function (userAccount) {
				if (userAccount.credentials === undefined) {
					return jwt.create(tokenData)
					.then(function(token){
						return credentialDAO.create({
						 account: userAccount.id,
						 device: device,
						 token: token
					 })
				 });
				}
				else if (!(userAccount.credentials.device === device)) {
					var newCredential = userAccount.credentials;
					return jwt.create(tokenData)
					.then(function(token) {
						newCredential.token = token;
						newCredential.device = device;
						return accountsDAO.update({email: email}, {credentials: newCredential})
						.then(function(userAccount) {
							resolve(userAccount.credentials.token);
						});
					})
				}
			})
			.catch(function(err){
				var data = err.message + " Problem to login";
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
		return credentialDAO.findOne()
	});
}

module.exports = accounts;
