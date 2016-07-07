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
		if (!validator.isAlphanumeric(description, 'pt-PT')) reject(new response(400,'extraneous description', 1));
		return credentialDAO.read(token)
		.then (function (credential) {
      if (!(credential.device === device )) reject(new response(400, 'extraneous device', 1));
      //else if (!(credential.account === school)) reject (new response(400, 'extraneous account', 1));
			return activitiesDAO.createActivityToSchool(school, description)
			.then(function(response) {
				resolve(response);
			}).catch(function(err) {
        var data = "Problem creating activities " + err.message;
				reject(new response(400, data, 1));
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
activities.addActivityToClass = function(school, class_id, activity, token) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(token)
    .then(function(credential){
      if (!(credential.device === device)) reject(new response(400, 'extraneous device', 1));
      return activitiesDAO.addActivityToClass(school, class_id, activity)
      .then(function(response){
        resolve(response);
      }).catch(function(err) {
        var data = "Problem adding Class " + err.message;
        reject(new response(400, data, 1));
      });
    });
  });
}

/**
* @description get activities for a given <tt>School</tt> after validates the <tt>Token</tt>
* @param School {id}
* @return activity {Array} it returns an array of activities
*/
activities.getActivityForSchool = function(school, token) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(token)
    .then(function(credential){
      if (!(credential.device === device)) reject(new response(400, 'extraneous device', 1));
      return activitiesDAO.readActivitiesForSchool(school)
      .then(function(activities){
        resolve(activities);
      }).catch(function(err) {
        var data = "Problem getting activities for Schools " + err.message;
        reject(new response(400, data, 1));
      });
    })
  });
}

/**
* @description get activities for a given <tt>Class</tt> after validates the <tt>Token</tt>
* @param Class {id}
* @return activity {Array} it returns an array of activities
*/
activities.getActivityForClass = function(school) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(token)
    .then(function(credential){
      if (!(credential.device === device)) reject(new response(400, 'extraneous device', 1));
      return activitiesDAO.readActivitiesForClass(Class)
      .then(function(activities){
        resolve(activities);
      }).catch(function(err) {
        var data = "Problem getting activities for Class " + err.message;
        reject(new response(400, data, 1));
      });
    })
  });
}
