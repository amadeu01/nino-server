/** @module business/profiles */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var awss3 = require('../mechanisms/AWSS3.js');
var activitiesDAO = require('../persistence/profiles.js');
var profilesDAO = require('../persistence/profiles.js');
var credentialDAO = require('../persistence/credentials.js');
var profiles = {};

/** @method create
* @param profile {JSON}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.create = function(profile, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					profilesDAO.create(profile)
					.then(function(profile_id) {
						resolve(responses.success(profile_id));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};
/** @method getMyProfile
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.getMyProfile = function(device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					profilesDAO.findWithId(token.profile)
					.then(function(profile) {
						resolve(responses.success(profile));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};
/** @method get
* @param profile_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.get = function(profile_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					profilesDAO.findWithId(profile_id)
					.then(function(profile) {
						resolve(responses.success(profile));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};
/** @method getProfilePicture
* @param profile_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.getProfilePicture = function(profile_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					awss3.downloadProfilePic("pp_" + profile_id + ".png")
					.then(function(response) {
						resolve(response);
					}).catch(function(err) {
						resolve(responses.internalError(err));
					});
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};
/** @method updatePicture
* @param profile_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.updateProfilePicture = function(profile_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					awss3.updateProfilePic(part, "pp_" + profile_id + ".png", part.byteCount)
					.then(function(success) {
						resolve(responses.success(success));
					}).catch(function(err) {
						resolve(responses.internalError(err));
					});
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};
/** @method update
* @param profileInfo {JSON}
* @param device {sting}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.update = function(profileInfo, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					profilesDAO.update(profileInfo)
					.then(function(success) {
						resolve(responses.success(success));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

/** @method delete
* @param profile_id {id}
* @param device {sting}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return
*/
profiles.delete = function(profile_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					profilesDAO.delete(profile_id)
					.then(function(success) {
						resolve(responses.success(success));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

module.exports = profiles;
