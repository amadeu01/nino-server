/** @module business/profiles */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var awss3 = require('../mechanisms/AWSS3.js');
var activitiesDAO = require('../persistence/profiles.js');
var errors = require('../mechanisms/error');
var profilesDAO = require('../persistence/profiles.js');
var credentialDAO = require('../persistence/credentials.js');
var profiles = {};

profiles.uploadProfilePicture = function(profile_id, part, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					awss3.uploadProfilePic(part, "pp_" + profile_id + ".png", part.byteCount)
					.then(function(success) {
						resolve( new response(200, success, null));
					}).catch(function(err) {
						reject(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			return(errors.internalError(err));
		});
	});
};
/** @method create
* @param
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.create = function(profile, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					profileDAO.create(profile)
					.then(function(success) {
						resolve( new response(200, success, null));
					}).catch(function(err) {
						reject(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			return(errors.internalError(err));
		});
	});
};
/** @method getMyProfile
* @param
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.getMyProfile = function(device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					awss3.findWithId(token.profile)
					.then(function(success) {
						resolve( new response(200, success, null));
					}).catch(function(err) {
						reject(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			return(errors.internalError(err));
		});
	});
};
/** @method get
* @param
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.get = function(profile_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					awss3.findWithId(profile_id)
					.then(function(success) {
						resolve( new response(200, success, null));
					}).catch(function(err) {
						reject(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			return(errors.internalError(err));
		});
	});
};
/** @method getProfilePicture
* @param
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.getProfilePicture = function(profile_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					awss3.getProfilePicture(part, "pp_" + profile_id + ".png", part.byteCount)
					.then(function(success) {
						resolve( new response(200, success, null));
					}).catch(function(err) {
						reject(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			return(errors.internalError(err));
		});
	});
};
/** @method updatePicture
* @param
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.updatePicture = function(device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					awss3.updateProfilePic(part, "pp_" + profile_id + ".png", part.byteCount)
					.then(function(success) {
						resolve( new response(200, success, null));
					}).catch(function(err) {
						reject(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			return(errors.internalError(err));
		});
	});
};
/** @method update
* @param profileInfo {JSON}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.update = function(profileInfo, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					profileDAO.upload(profileInfo)
					.then(function(success) {
						resolve( new response(200, success, null));
					}).catch(function(err) {
						reject(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			return(errors.internalError(err));
		});
	});
};

module.exports = profiles;
