/** @module business/credentials */

var uid = require('uid-safe');
var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var schoolsDAO = require('../persistence/schools.js');
var credentialDAO = require('../persistence/credentials.js');
var contentsDAO = require('../persistence/contents.js');
var contents = {};
var awss3 = require('../mechanisms/AWSS3.js');

contents.uploadContent = function(profile, school, part, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		
		var upload = function() {
			var key = uid.sync(100) + part.filename.split('.').pop(); // Generates random key for that file			
		
			contentsDAO.createContent(profile, school, key, function(){return awss3.uploadContent(part, key, part.byteCount);})
			.then(function(result) {
				resolve(responses.success(result));
			}).catch(function(err, done) {
				resolve(responses.persistenceError(err));
			});
		};
		
		credentialDAO.read(rawToken)
		.then(function(credential){
			
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else if (profile !== undefined) {
				//VALIDATES THIS REQUEST
				upload();
			} else if (school !== undefined) {
				//VALIDATES THIS REQUEST
				upload();
			} else {
				resolve(responses.missingParameters("owner"));
			}
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

contents.downloadContent = function(key, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		var download = function() {
			awss3.downloadContent(key)
			.then(function(success) {
				resolve(success);
			}).catch(function(err) {
 				resolve(responses.internalError(err));
 			});
		};
		credentialDAO.read(rawToken)
		.then(function(credential){
			//TODO: Validate User Permissions
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else return contentsDAO.getContentWithKey(key)
			.then(function(content){
				if (content.access === 1) {
					download();
				} else {
					//VALIDATE PERMISSIONS
					download();
				}
			}).catch(function(err){
				resolve(responses.persistenceError(err));
			});
		}).catch(function(err) {
 			resolve(responses.persistenceError(err));
 		});
	});
};

contents.deleteContent = function(key, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		
		var deleteContent = function() {
			contentsDAO.deleteContentWithKey(key, function() {awss3.deleteContent(key);})
			.then(function(success) {
				resolve(success);
			}).catch(function(err) {
 				resolve(responses.internalError(err));
 			});
		};
		
		credentialDAO.read(rawToken)
		.then(function(credential){
			//TODO: Validate User Permissions
			if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			else return contentsDAO.getContentWithKey(key)
			.then(function(content){
				//VALIDATE PERMISSIONS
				contentsDAO.getContentWithKey(key, remove)
				.then(function(success) {
					deleteContent();
				}).catch(function(error) {
					resolve(responses.persistenceError(err));
				});
			}).catch(function(err){
				resolve(responses.persistenceError(err));
			});
		}).catch(function(err) {
 			resolve(responses.persistenceError(err));
 		});
	});
};

module.exports = contents;
