/** @module business/profiles */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var awss3 = require('../mechanisms/AWSS3.js');
var activitiesDAO = require('../persistence/profiles.js');
var profiles = {};

profiles.uploadProfilePicture = function(profileID, pictureData, rawToken, device) {
  return credentialDAO.read(rawToken)
	.then(function(credential){
		if ((credential.device !== device)) throw (errors.invalidParameters("device"));
		else return awss3.uploadProfilePic(profileID, pictureData)
			.then(function(success) {
				return new response(200, success, null);
			})
			.catch(function(err) {
				return(errors.internalError(err));
			});
	})
	.catch(function(err) {
		return(errors.internalError(err));
	});
};

module.exports = profiles;

