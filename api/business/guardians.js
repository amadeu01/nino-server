/** @module business/guardians */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var guardiansDAO = require('../persistence/guardians.js');
var credentialDAO = require('../persistence/credentials.js');
var errors = require('../mechanisms/error');
var guardians = {};

guardians.create = function(account, profile, student_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					guardiansDAO.create(profile, account, student_id)
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

module.exports = guardians;
