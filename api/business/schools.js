/** @module business/schools */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var schoolDAO = require('../persistence/schools.js');
var credentialDAO = require('../persistence/credentials.js');
var errors = require('../mechanisms/error');
var schools = {};


/**

*@return School {id}
*/
schools.create = function(school, device, rawToken, token) {
	//TODO: func do BO que vai validar as coisas e mandar o DAO criar. O route ta fazendo boa parte da validação, separa isso depois de modo que lá só verifique se existe e aqui valide :)
	console.log("In BO");
	return new Promise(function(resolve, reject) {
	    return credentialDAO.read(rawToken)
   		.then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			//else if (!validator.isNumeric(school)) reject(errors.invalidParameters("school_id")); //TODO: aqui nao temos o school_id :v
			else {
				return schoolDAO.create(school, token.profile)
				.then(function(school_id){
					resolve(new response(200, school_id, null));
				}).catch(function(err){
					reject(errors.internalError(err));
				});
			}
    	}).catch(function(err) {
			reject(errors.internalError(err));//TODO: Amadeu, esse catch nao existia, sepa por isso que nao retornas as vezes
		});
  });
};

schools.read = function(school_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else if (!validator.isNumeric(school)) reject(errors.invalidParameters("school_id"));
			//TODO: can read school ? no, so reject
			else {

				return schoolDAO.read(school_id)
				.then(function(school){
					resolve(new response(200, school, null));
				}).catch(function(err){
					reject(errors.internalError(err));
				});
			}
    });
  });
};

schools.update = function(school, rawToken, token) {
	return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else if (!validator.isNumeric(school)) reject(errors.invalidParameters("school_id"));
			//TODO: can read school ? no, so reject
			else {

				return schoolDAO.update(school)
				.then(function(school_id){
					resolve(new response(200, school_id, null));
				}).catch(function(err){
					reject(errors.internalError(err));
				});
			}
    });
  });
};
schools.setLogo = function() {

};
schools.delete = function(school_id, rawToken, token) {
	return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
			if ((credential.device !== device)) reject(errors.invalidParameters("device"));
			else if (!validator.isNumeric(school)) reject(errors.invalidParameters("school_id"));
			//TODO: can read school ? no, so reject
			else {

				return schoolDAO.delete(school_id)
				.then(function(school_id){
					resolve(new response(200, school_id, null));
				}).catch(function(err){
					reject(errors.internalError(err));
				});
			}
    });
  });
};

module.exports = schools;
