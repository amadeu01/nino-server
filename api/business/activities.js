/** @module business/activities */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var activitiesDAO = require('../persistence/activities.js');
var credentialDAO = require('../persistence/credentials.js');
var jwt = require('../mechanisms/jwt.js');
var activities = {};

/**
* @description Create activity to a given <tt>School</tt> if it has autorized to do so, by token authentication.
* @param School {id}
* @param Description {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return response {Promise} if successful, it returns response with successful boolean data set true.
*/
activities.createActivityToSchool = function(school, description, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		if (!validator.isAlphanumeric(description, 'pt-PT')) resolve(responses.invalidParameters("description"));
		else return credentialDAO.read(rawToken)
		.then (function (credential) {
      if (credential.device !== device ) resolve(responses.invalidCredential("extraneous device"));
			else return activitiesDAO.createActivityToSchool(school, description)
			.then(function(response) {
        //Response should be activity id.
				resolve(responses.success(responses));
			}).catch(function(err) {
				resolve(responses.persistenceError(err));
			});
		}).catch(function(err) {
			resolve(responses.persistenceError(err));
		});
	});
};

/**
* @description Add activity to the current class in process after validates the <tt>Token</tt>
* @param School {id}
* @param Class {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @param activity {Activity} parameters filled with information about activity
* @return response {Promise} if successful, it returns response with successful boolean data set true.
*/
activities.addActivityToClass = function(school, class_id, activity, rawToken, token) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) resolve(responses.invalidCredential("extraneous device"));
      else return activitiesDAO.addActivityToClass(school, class_id, activity)
      .then(function(response){
        resolve(responses.success(response));
      }).catch(function(err) {
        resolve(responses.persistenceError(err));
      });
    }).catch(function(err) {
    	resolve(responses.persistenceError(err));
    });
  });
};

/**
* @description get activities for a given <tt>School</tt> after validates the <tt>Token</tt>
* @param school_class {id} school_id or class_id
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return response {Promise} if successful, it returns an array of activities (<b>Array<activities></b>) inside response data.
*/
activities.getActivity = function(who, school_class, rawToken, token) {

  return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) resolve(responses.invalidCredential("extraneous device"));
      else if (who === "forSchool") {
        return activitiesDAO.readActivitiesForSchool(school_class)
        .then(function(activities){
          resolve(new response(200, activities, null));
        }).catch(function(err) {
          resolve(responses.persistenceError(err));
        });
      } else if (who === "forClass") {
        return activitiesDAO.readActivitiesForClass(school_class)
        .then(function(activities){
          resolve(responses.success(activities));
        }).catch(function(err) {
          resolve(responses.persistenceError(err));
        });
      }
    }).catch(function(err) {
    	resolve(responses.persistenceError(err));
    });
  });
};

module.exports = activities;
