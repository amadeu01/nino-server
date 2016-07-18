/** @module business/guardians */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var guardiansDAO = require('../persistence/guardians.js');
var studentsDAO = require('../persistence/students.js');
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
					guardiansDAO.create(account, profile, student_id)
					.then(function(guardian_id) {
						resolve( new response(200, guardian_id, null));
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
* @param guardian_id
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
					studentsDAO.findWithGuardianId(guardian_id)
					.then(function(guardianInfo) {
						resolve( new response(200, guardianInfo, null));
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

module.exports = guardians;
