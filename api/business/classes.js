/** @module business/classes */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var classesDAO = require('../persistence/classes.js');
var credentialDAO = require('../persistence/credentials.js');
var errors = require('../mechanisms/error');
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
			//if (!validator.isNumeric(school)) invalidParameters.push("school_id");
			//if (!validator.isAlphanumeric(class_name, 'pt-PT')) invalidParameters.push("class_name");
			if (invalidParameters.length > 0) reject(errors.invalidParameters(invalidParameters));
			//TODO: can create class ? no, so reject
			else {
				var _class = {
					name: class_name
				};
				return classesDAO.create(_class, school_id)
				.then(function(class_id) {
					//console.log(class_id);
					resolve(new response(200, class_id, null));
				}).catch(function(err){
					//var data = err.message + " Create class for school";
					reject(errors.internalError(err));
				});
			}
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
			if (credential.device !== device) reject(errors.invalidParameters("device"));
			//if (!validator.isNumeric(school)) reject(errors.invalidParameters("school_id")); //Validates only string
			//it can getting all classes ? token info ?
			return classesDAO.findWithSchoolId(school_id)
			.then(function(result){
				resolve(new response(200, result, null));
			}).catch(function(err){
				reject(errors.internalError(err));
			});
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
			if (credential.device !== device) reject(errors.invalidParameters("device"));

			return classesDAO.delete(class_id)
			.then(function(result){
				console.log(result);
				resolve(new response(200, result, null));
			}).catch(function(err){
				reject(errors.internalError(err));
			});
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
			if (credential.device !== device) reject(errors.invalidParameters("device"));

			return classesDAO.update(classInfo)
			.then(function(result){
				console.log(result);
				resolve(new response(200, result, null));
			}).catch(function(err){
				reject(errors.internalError(err));
			});
		});
	});
};

module.exports = classes;
