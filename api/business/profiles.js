/** @module business/profiles */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var awss3 = require('../mechanisms/AWSS3.js');
var activitiesDAO = require('../persistence/profiles.js');
var profiles = {};
var multiparty = require('multiparty');

profiles.uploadProfilePicture = function(profileID, rawToken, device, req) {
	return new Promise(function(resolve, reject) {
		var gotImage = false;
		credentialDAO.read(rawToken)
		.then(function(credential){
			if ((credential.device !== device)) throw (errors.invalidParameters("device"));
			else {
				console.log("Starting form");
				var form = new multiparty.Form();
				form.on('error', function(err) {
					reject(errors.internalError(err));
				});
				form.on('part', function(part) {
					gotImage = true;
					awss3.uploadProfilePic(part, "pp_" + profileID + ".png", part.byteCount)
					.then(function(success) {
						resolve( new response(200, success, null));
					}).catch(function(err) {
						reject(errors.internalError(err));
					});
				});
				form.on('close', function() {
					if (!gotImage) {
						reject(errors.missingParameters("picture"));
					}
				});
				form.parse(req);
			}
		})
		.catch(function(err) {
			return(errors.internalError(err));
		});
	});
};

module.exports = profiles;

