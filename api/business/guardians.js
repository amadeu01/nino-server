/** @module business/guardians */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var guardiansDAO = require('../persistence/guardians.js');
var studentsDAO = require('../persistence/students.js');
var schoolsDAO = require('../persistence/schools.js');
var uid = require('uid-safe');
var credentialDAO = require('../persistence/credentials.js');
var profileDAO = require('../persistence/profiles.js');
var guardians = {};
var mail = require('../mechanisms/mail.js');

/** @method create
* @param account
* @param profile
* @param student_id
* @param device
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
guardians.create = function(school_id, account, student_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else return schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, school_id)
		  	.then(function(id) {
		    	return studentsDAO.findWithSchoolAndStudentProfile(school_id, student_id);
			}).then(function(student){
				return guardiansDAO.findWithEmail(account.email)
				.then(function(guardian_profile) {
					guardiansDAO.addStudentToGuardian(guardian_profile.id, student_id)
					.then(function(guardian) {
						//TODO: Send email to notice guardian and verify if is confirmed
						resolve(responses.success(guardian));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
				}).catch(function(err) {
					account.hash = uid.sync(100);
					guardiansDAO.create(account, student.id)
					.then(function(guardian_id) {
						mail.sendUserConfirmation(account.email, {hash: account.hash});
						resolve(responses.success(guardian_id));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
				});
			}).catch(function(err){
      			resolve(responses.invalidPermissions(err));
      		});
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

/** @method readForStudents
* @param school_id
* @param guardian_id
* @param device
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return guardians {Array<Guardian>}
*/
guardians.readForStudents = function(student_profile_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			return studentsDAO.findWithEmployeeProfileAndStudentProfile(token.profile, student_profile_id)
		    .then(function(id){
				guardiansDAO.findWithStudentProfile(student_profile_id)
				.then(function(students) {
					resolve(responses.success(students));
				}).catch(function(err) {
					resolve(responses.persistenceError(err));
				});
			}).catch(function(err){
        		resolve(responses.invalidPermissions(err));
      		});
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
guardians.read = function(school_id, guardian_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
      if (guardian_id === token.profile) {
        profileDAO.findWithId(guardian_id)
        .then(function(guardianInfo) {
          resolve(responses.success(guardianInfo));
        }).catch(function(err) {
          resolve(responses.persistenceError(err));
        });
      }
			else {
        return schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, school_id)
        .then(function(id){
          profileDAO.findWithId(guardian_id)
					.then(function(guardianInfo) {
						resolve(responses.success(guardianInfo));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
        }).catch(function(err){
          resolve(responses.invalidPermissions(err));
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
* @return guardians {Array<Guardian>}
* @deprecated
*/
guardians.findWithStudentId = function(student_profile_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else {
					studentsDAO.findWithGuardianProfileAndStudentProfile(token.profile, student_profile_id)
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
