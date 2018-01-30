/** @module business/agendas */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var agendasDAO = require('../persistence/agendas.js');
var credentialDAO = require('../persistence/credentials.js');
var agendas = {};


/** @method createNewUser
 * @description Create a new Profile and links it to a new Account. Validates required parameters and returns a promisse, calling the DAO to write to the DB
 * @param account
 * @param profile
 * @param device {string} it defines from which plataform and os the request come from
 * @return promise {Promise} if it works it returns JSON with profile id and account id
 */
agendas.createAgendaForClass = function(agenda, class_id, device, rawtoken, token) {
	return new Promise(function(resolve, reject) {
		var invalidParameters = [];
		for (var i in agenda) {
			var localInvalid = [];
			if (!validator.isAlphanumeric(agenda[i].title, 'pt-PT')) localInvalid.push("title");
			if (agenda[i].rows.length === 0) localInvalid.push("rows");
			else {
				for (var j in agenda[i].rows) {
					var internalInvalid = [];
					if (isNaN(agenda[i].rows[j].type)) internalInvalid.push("type");
					
					if (internalInvalid.length > 0) localInvalid.push({j: internalInvalid});
				}
			}
			
			if (localInvalid.length > 0) invalidParameters.push({i: localInvalid});
		}
		if (invalidParameters.length > 0) reject(responses.missingParameters(invalidParameters));
		
		else return credentialDAO.read(rawToken)
		.then (function (credential) {
      if (credential.device !== device ) resolve(responses.invalidCredential("extraneous device"));
			else return agendasDAO.createAgendaForClass(class_id, agenda)
			.then(function(response) {
				resolve(responses.success(responses));
			}).catch(function(err) {
				resolve(responses.persistenceError(err));
			});
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

module.exports = agendas;
