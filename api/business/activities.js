/** @module business/activities */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var activitiesDAO = require('../persistence/activities.js');
var credentialDAO = require('../persistence/credentials.js');
var jwt = require('../mechanisms/jwt.js')
var activities = {};

/**
* @description Create activity to a given <tt>School</tt> if it has autorized to do so, by token authentication.
* @param School {id}
* @param Description {string}
* @param token {string} token decoded
* @return activity {id}
*/
activities.createActivityToSchool = function(school, description, device, token ) {
  return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) reject(new response(400,'email',1));
		return credentialDAO.read(token)
		.then (function (credential) {
      if (!(credential === token)) reject(new response(400, 'Create activity'))
			return activitiesDAO.createActivityToSchool(school, description)
			.then(function(response) {
				resolve(response);
			}).catch(function(err) {
        var data = "Create activity to school" + err.message;
				reject(err);
			});
		});
	});
}

/**
* @description Add activity to the current class in process after validates the <tt>Token</tt>
* @param School {id}
* @param Class {id}
* @param activity {Activity} parameters filled with information about activity
*/
activities.addActivityToClass = function(school, activity, class_id, token) {
  return new Promise(function(resolve, reject) {
    return activitiesDAO.addActivityToClass(school, class_id, activity);
  }).then(function(response){
    resolve(response);
  }).catch(function(err) {
    reject(err);
  });
}

/**
* @description get activities for a given <tt>School</tt> after validates the <tt>Token</tt>
* @param School {id}
* @return activity {Array} it returns an array of activities
*/
activities.getActivityForSchool = function(school) {
  return new Promise(function(resolve, reject) {
    return activitiesDAO.getActivityForSchool(school);
  }).then(function(activities){
    resolve(activities);
  }).catch(function(err) {
    reject(err);
  });
}

/**
* @description get activities for a given <tt>Class</tt> after validates the <tt>Token</tt>
* @param Class {id}
* @return activity {Array} it returns an array of activities
*/
activities.getActivityForClass = function(class_id) {
  return new Promise(function(resolve, reject) {
    return activitiesDAO.getActivityForClass(class_id);
  }).then(function(activities){
    resolve(activities);
  }).catch(function(err) {
    reject(err);
  });
}
