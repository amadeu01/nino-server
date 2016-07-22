/** @module business/classes */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var classesDAO = require('../persistence/classes.js');
var credentialDAO = require('../persistence/credentials.js');
var classes = {};


/** @method createNewUser
 * @description Create a new <tt>Class</tt> and adds it to a given <tt>School</tt>. Validates required parameters and returns a promisse, calling the DAO to write to the DB
 * @param class_name {string} class name
 * @param school {id}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise} resolving a response with result in data, if succeful, class_id
 */
classes.createClassForSchool = function(class_name, school_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
			var invalidParameters = [];
			if ((credential.device !== device)) invalidParameters.push("device");
			if (invalidParameters.length > 0) resolve(responses.invalidParameters(invalidParameters));
			//TODO: can create class ? no, so reject
			else {
				var _class = {
					name: class_name
				};
				return classesDAO.create(_class, school_id)
				.then(function(class_id) {
					resolve(responses.success(class_id));
				}).catch(function(err){
					resolve(responses.persistenceError(err));
				});
			}
    }).catch(function(err) {
    	resolve(responses.persistenceError(err));
    });
  });
};
/** @method getClassesForSchool
* @description Get all classes linked to that given school
* @param school {id} school id
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return response {Promise} resolving the array of classes. If succeful, returns Array<Class> with <p> id <p> menu.id <p> name
*/
classes.getClassesForSchool = function(school_id, device, rawToken, token) {
	return new Promise(function(resolve, reject){
		return credentialDAO.read(rawToken)
		.then(function(credential){
			if (credential.device !== device) resolve(responses.invalidParameters("device"));
			//it can getting all classes ? token info ?
			else return classesDAO.findWithSchoolId(school_id)
			.then(function(result){
				resolve(responses.success(result));
			}).catch(function(err){
				resolve(responses.persistenceError(err));
			});
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

/** @method delete
* @description delete
* @param school_id {id}
* @param class_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
classes.delete = function (school_id, class_id, device, rawToken, token) {
	return new Promise(function(resolve, reject){
		return credentialDAO.read(rawToken)
		.then(function(credential){
			if (credential.device !== device) resolve(responses.invalidParameters("device"));
			else return classesDAO.delete(class_id)
			.then(function(result){
				resolve(responses.success(result));
			}).catch(function(err){
				resolve(responses.persistenceError(err));
			});
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

/** @method update
* @description update
* @param school_id {id}
* @param classInfo {JSON}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
classes.update = function (school_id, classInfo, device, rawToken, token) {
	return new Promise(function(resolve, reject){
		return credentialDAO.read(rawToken)
		.then(function(credential){
			if (credential.device !== device) resolve(responses.invalidParameters("device"));
			else return classesDAO.update(classInfo)
			.then(function(result){
				resolve(responses.success(result));
			}).catch(function(err){
				resolve(responses.persistenceError(err));
			});
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

module.exports = classes;
