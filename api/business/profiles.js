/** @module business/profiles */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var awss3 = require('../mechanisms/AWSS3.js');
var activitiesDAO = require('../persistence/profiles.js');
var profilesDAO = require('../persistence/profiles.js');
var credentialDAO = require('../persistence/credentials.js');
var studentsDAO = require('../persistence/students.js');
var guardiansDAO = require('../persistence/students.js');
var profiles = {};

/** @method create
* @param profile {JSON}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return promise
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
* @return promise
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
* @return promise
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
* @return promise
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
* @return promise
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
* @return promise
*/
profiles.update = function(profile_id, profileInfo, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
				if (profile_id === token.profile) {
					profilesDAO.update(pprofile_id, rofileInfo)
					.then(function(success) {
						resolve(responses.success(success));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
				}
				else studentsDAO.findWithEmployeeProfileAndStudentProfile(token.profile, profile_id)
				.then(function(student) {
					profilesDAO.update(profile_id, profileInfo)
					.then(function(success) {
						resolve(responses.success(success));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
				}).catch(function(err) {
					return studentsDAO.findWithGuardianProfileAndStudentProfile(token.profile, profile_id);
				}).then(function(student) {
					profilesDAO.update(profile_id, profileInfo)
					.then(function(success) {
						resolve(responses.success(success));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
				}).catch(function(err) {
					resolve(responses.invalidPermissions());
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
* @return promise
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
