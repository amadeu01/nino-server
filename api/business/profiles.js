/** @module business/profiles */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var awss3 = require('../mechanisms/AWSS3.js');
var activitiesDAO = require('../persistence/profiles.js');
var profiles = {};

profiles.uploadProfilePicture = function(profileID, rawToken, device, part) {
	return new Promise(function(resolve, reject) {
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else {
					awss3.uploadProfilePic(part, "pp_" + profileID + ".png", part.byteCount)
					.then(function(success) {
						resolve( new response(200, success, null));
					}).catch(function(err) {
						reject(errors.internalError(err));
					});
				});
			}
		})
		.catch(function(err) {
			return(errors.internalError(err));
		});
	});
};

module.exports = profiles;

