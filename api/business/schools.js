/** @module business/schools */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var schoolDAO = require('../persistence/schools.js');
var credentialDAO = require('../persistence/credentials.js');
var errors = require('../mechanisms/error');
var schools = {};
var awss3 = require('../mechanisms/AWSS3.js');


/** @method create
* @description Create a new <tt>School</tt>
* @return School {id}
*/
schools.create = function(school, device, rawToken, token) {
	//TODO: func do BO que vai validar as coisas e mandar o DAO criar. O route ta fazendo boa parte da validação, separa isso depois de modo que lá só verifique se existe e aqui valide :)
	//console.log("In BO");
	return new Promise(function(resolve, reject) {
	    return credentialDAO.read(rawToken)
   		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			//else if (!validator.isNumeric(school)) reject(errors.invalidParameters("school_id")); //TODO: aqui nao temos o school_id :v
			else {
				//console.log(token.profile);
				return schoolDAO.create(school, token.profile)
				.then(function(school_id){
					resolve(new response(200, school_id, null));
				}).catch(function(err){
					reject(errors.internalError(err));
				});
			}
    	}).catch(function(err) {

				//when there is a error abose that first return, we need to treat it here :)
				reject(errors.internalError(err));
		});
  });
};

/** @method read
* @description Read a <tt>School</tt>
* @param school {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return School {id}
*/
schools.read = function(school_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
			//console.log(credential);
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			//if (!validator.isNumeric(school_id)) reject(errors.invalidParameters("school_id")); //validates only strings
			//TODO: can read school ? no, so reject
			else {
				return schoolDAO.findWithId(school_id)
				.then(function(school){
					//console.log(school);
					resolve(new response(200, school, null));
				}).catch(function(err){
					reject(errors.internalError(err));
				});
			}
    }).catch(function(err){
			console.log(err);
		});
  });
};
/** @method update
* @param schoolInfo {JSON} what will be updated
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
schools.update = function(school, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			//else if (!validator.isNumeric(school)) reject(errors.invalidParameters("school_id")); validades only strings
			//TODO: can read school ? no, so reject
			else {

				return schoolDAO.update(school)
				.then(function(school_id){
					resolve(new response(200, school_id, null));
				}).catch(function(err){
					reject(errors.internalError(err));
				});
			}
    });
  });
};

//Should be a same update method of DAO
/** @method setLogo
* @description Set school's logo
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
schools.setLogo = function(school_id, rawToken, device, part) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			//TODO: Validate User Permissions
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					awss3.uploadLogotype(part, "logo_" + school_id + ".png", part.byteCount)
					.then(function(success) {
						resolve( new response(200, success, null));
					}).catch(function(err) {
						reject(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			reject(errors.internalError(err));
		});
	});
};

schools.readLogo = function(school_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			//TODO: Validate User Permissions
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					awss3.downloadLogotype("logo_" + school_id + ".png")
					.then(function(success) {
						resolve(success);
					}).catch(function(err) {
						resolve(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			resolve(errors.internalError(err));
		});
	});
}

/** @method delete
* @param schoolInfo {JSON} what will be updated
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
schools.delete = function(school_id, rawToken, token) {
	return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			//else if (!validator.isNumeric(school)) reject(errors.invalidParameters("school_id")); validades only strings
			//TODO: can read school ? no, so reject
			else {

				return schoolDAO.delete(school_id)
				.then(function(school_id){
					resolve(new response(200, school_id, null));
				}).catch(function(err){
					reject(errors.internalError(err));
				});
			}
    });
  });
};

module.exports = schools;
