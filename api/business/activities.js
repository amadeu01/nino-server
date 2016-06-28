/** @module business/activities */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var activitiesDAO = require('../persistence/activities.js');
var activities = {};

/***
* @param School {id}
* @param Description {string}
* @param token {string}
* @return activity {id}
*/
activities.createActivityToSchool = function(school, description, token ) {
  return new Promise(function(resolve, reject) {
		//if (!validator.isEmail(account.email)) reject(new response(400),'email',1);
		//if (token)
		else {
			activitiesDAO.createActivityToSchool(school, description)
			.then(function(response) {
				resolve(response);
			}).catch(function(error) {
				reject(error);
			});
		}
	});
}
