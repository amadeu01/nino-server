/** @module business/classes */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var classesDAO = require('../persistence/classes.js');
var credentialDAO = require('../persistence/credentials.js');
var classes = {};


/** @method createNewUser
 * @description Create a new <tt>Class</tt> and adds it to a given <tt>School</tt>. Validates required parameters and returns a promisse, calling the DAO to write to the DB
 * @param class_name {string} class name
 * @param school {id}
 * @param token {string} Gives permition to create class
 * @return promise {Promise} if it works it returns JSON with class id
 */
classes.createClassForSchool = function(class_name, school, device, token) {
	return new Promise(function(resolve, reject) {
    return credentialDAO.read(token)
    .then(function(credential){
			if (!(credential.device === device)) reject(new response(400, 'extraneous device', 1));
			else if (!validator.isAlphanumeric(class_name, 'pt-PT')) reject(new response(400, 'extraneous name', 1));
			else if (!(school === credential.account)) reject(new response(400, 'extraneous account', 1));
			else {
				var _class = {
					name: class_name
				};
				return classesDAO.create(_class, school)
				.then(function(class_id){
					resolve(class_id);
				}).catch(function(err){
					var data = err.message + " Create class for school";
					reject(new response(400, data, 1));
				});
			}
    })
  });
}

classes.getClassesForSchool = function(school, token) {
	new Promise(function(resolve, reject){
		return credentialDAO.read(token)
		.then(function(credential){
			if (!(school === credential.account)) reject(new response(400, 'extraneous account', 1));
			//waiting persistence \0/
		}).catch(function(err){
			var data = "Get classes for school " + err.message;
			reject(new response(400, data, 1));
		});
	});
}


module.exports = classes;
