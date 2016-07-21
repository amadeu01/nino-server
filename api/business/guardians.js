/** @module business/guardians */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var guardiansDAO = require('../persistence/guardians.js');
var studentsDAO = require('../persistence/students.js');
var uid = require('uid-safe');
var credentialDAO = require('../persistence/credentials.js');
var errors = require('../mechanisms/error');
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
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
        account.hash = uid.sync(100);
        guardiansDAO.create(account, profile, student_id)
				.then(function(guardian_id) {
					resolve( new response(200, guardian_id, null));
				}).catch(function(err) {
					resolve(errors.persistenceError(err));
				});
			}
		})
		.catch(function(err) {
			resolve(errors.persistenceError(err));
		});
	});
};

/** @method findStudents
* @param guardian_id
* @param device
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
guardians.findStudents = function(guardian_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					studentsDAO.findWithGuardianId(guardian_id)
					.then(function(students) {
						resolve( new response(200, students, null));
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
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					guardiansDAO.findWithProfileId(guardian_id)
					.then(function(guardianInfo) {
						resolve( new response(200, guardianInfo, null));
					}).catch(function(err) {
						resolve(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			resolve(errors.internalError(err));
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
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					studentsDAO.findWithProfileId(token.profile)
					.then(function(guardianInfo) {
						resolve( new response(200, guardianInfo, null));
					}).catch(function(err) {
						resolve(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			resolve(errors.internalError(err));
		});
	});
};
/** @method findWithStudentId
* @param student_id {id} Id from profile
* @param device
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
guardians.findWithStudentId = function(student_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					studentsDAO.findGuardiansWithProfileId(token.profile)
					.then(function(guardians) {
						resolve( new response(200, guardians, null));
					}).catch(function(err) {
						resolve(errors.internalError(err));
					});
			}
		})
		.catch(function(err) {
			resolve(errors.internalError(err));
		});
	});
};

module.exports = guardians;
