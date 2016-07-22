/** @module business/guardians */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var guardiansDAO = require('../persistence/guardians.js');
var studentsDAO = require('../persistence/students.js');
var uid = require('uid-safe');
var credentialDAO = require('../persistence/credentials.js');
var guardians = {};

/** @method create
* @param account
* @param profile
* @param student_id
* @param device
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
guardians.create = function(account, profile, student_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
        account.hash = uid.sync(100);
        guardiansDAO.create(account, profile, student_id)
				.then(function(guardian_id) {
					resolve(responses.success(guardian_id));
				}).catch(function(err) {
					resolve(responses.persistenceError(err));
				});
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

/** @method readForStudents
* @param guardian_id
* @param device
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
guardians.readForStudents = function(school_id, student_profile_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					guardiansDAO.findWithSchoolAndStudentProfile(school_id, student_profile_id)
					.then(function(students) {
						resolve(responses.success(students));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

/** @method read
* @param guardian_id {id} Id from profile
* @param device
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
guardians.read = function(guardian_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					guardiansDAO.findWithProfileId(guardian_id)
					.then(function(guardianInfo) {
						resolve(responses.success(guardianInfo));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

/** @method readMe
* @param device
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
guardians.readMe = function(device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					guardiansDAO.findWithProfileId(token.profile)
					.then(function(guardianInfo) {
						resolve(responses.success(guardianInfo));
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
* @param guardian_id {id} Id from profile
* @param student_profile_id {id} Id from profile
* @param device
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
guardians.delete = function(guardian_id, student_profile_id, evice, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {

			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

/** @method findWithStudentId
* @param student_id {id} Id from profile
* @param device
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @deprecated
*/
guardians.findWithStudentId = function(student_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					studentsDAO.findGuardiansWithProfileId(token.profile)
					.then(function(guardians) {
						resolve(responses.success(guardians));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

module.exports = guardians;
