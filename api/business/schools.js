/** @module business/schools */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var schoolDAO = require('../persistence/schools.js');
var credentialDAO = require('../persistence/credentials.js');
var schools = {};
var awss3 = require('../mechanisms/AWSS3.js');


/** @method create
* @description Create a new <tt>School</tt>
* @return School {id}
*/
schools.create = function(school, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
	    return credentialDAO.read(rawToken)
   		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
				return schoolDAO.create(school, token.profile)
				.then(function(school_id){
					resolve(responses.success(school_id));
				}).catch(function(err){
					resolve(responses.persistenceError(err));
				});
			}
    	}).catch(function(err) {
				//when there is a error abose that first return, we need to treat it here :)
				resolve(responses.persistenceError(err));
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
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			//TODO: can read school ? no, so reject
			else {
				return schoolDAO.findWithId(school_id)
				.then(function(school){
					resolve(responses.success(school));
				}).catch(function(err){
					resolve(responses.persistenceError(err));
				});
			}
    }).catch(function(err){
			resolve(responses.persistenceError(err));
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
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			//TODO: can read school ? no, so reject
			else {
				return schoolDAO.update(school)
				.then(function(school_id){
					resolve(responses.success(school_id));
				}).catch(function(err){
					resolve(responses.persistenceError(err));
				});
			}
    }).catch(function(err) {
    	resolve(responses.persistenceError(err));
    });
  });
};

//Should be a same update method of DAO
/** @method setLogo
* @description Set school's logo
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
schools.setLogo = function(school_id, device, rawToken, token, part) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			//TODO: Validate User Permissions
			//TODO: Check if data type is png
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					awss3.uploadLogotype(part, "logo_" + school_id + ".png", part.byteCount)
					.then(function(success) {
						resolve(responses.success(success));
					}).catch(function(err) {
						resolve(responses.internalError(err));
					});
			}
		})
		.catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

schools.readLogo = function(school_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			//TODO: Validate User Permissions
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
				return schoolDAO.findWithEmployeeProfileAndSchool(token.profile, school_id)
				.then(function(result) {
					awss3.downloadLogotype("logo_" + school_id + ".png")
					.then(function(success) {
						resolve(success); //TODO: Delete this comment too, just to inform that here i am returning a response from amazon, i will pipe it, thats why its not a response object :)
					}).catch(function(err) {
		 				resolve(responses.internalError(err));
		 			});
				}).catch(function() { //Error here means that its not authorized
					resolve(responses.invalidCredential());
				});
			}
		}).catch(function(err) {
 			resolve(responses.persistenceError(err));
 		});
	});
};

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
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			//TODO: can read school ? no, so reject
			else {
				return schoolDAO.delete(school_id)
				.then(function(school_id){
					resolve(responses.success(school_id));
				}).catch(function(err){
					resolve(responses.persistenceError(err));
				});
			}
    }).catch(function(err) {
    	resolve(responses.persistenceError(err));
    });
  });
};

module.exports = schools;
