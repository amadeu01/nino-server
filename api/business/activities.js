/** @module business/activities */

var validator = require('validator');
var errors = require('../mechanisms/error.js');
var response = require('../mechanisms/response.js');
var activitiesDAO = require('../persistence/activities.js');
var credentialDAO = require('../persistence/credentials.js');
var jwt = require('../mechanisms/jwt.js');
var activities = {};

/**
* @description Create activity to a given <tt>School</tt> if it has autorized to do so, by token authentication.
* @param School {id}
* @param Description {string}
* @param rawToken {JSON} token decoded
* @param token {string} hash token saved.
* @return response {Promise} if successful, it returns response with successful boolean data set true.
*/
activities.createActivityToSchool = function(school, description, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
		if (!validator.isAlphanumeric(description, 'pt-PT')) reject(errors.invalidParameters("description"));
		return credentialDAO.read(rawToken)
		.then (function (credential) {
      if (credential.device !== device ) reject(errors.invalidCredential("extraneous device"));
      //else if (!(credential.account === school)) reject (new response(400, 'extraneous account', 1));
			return activitiesDAO.createActivityToSchool(school, description)
			.then(function(response) {
        //Response should be activity id.
				resolve(new response(200, response, null));
			}).catch(function(err) {
        //var data = "Problem creating activities " + err.message;
				reject(errors.internalError(err));
			});
		});
	});
};

/**
* @description Add activity to the current class in process after validates the <tt>Token</tt>
* @param School {id}
* @param Class {id}
* @param rawToken {string}
* @param token {JSON}
* @param activity {Activity} parameters filled with information about activity
* @return response {Promise} if successful, it returns response with successful boolean data set true.
*/
activities.addActivityToClass = function(school, class_id, activity, rawToken, token) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) reject(errors.invalidCredential("extraneous device"));
      return activitiesDAO.addActivityToClass(school, class_id, activity)
      .then(function(response){
        //should say if it was successful
        resolve(new response(200, response, null));
      }).catch(function(err) {
        //var data = "Problem adding Class " + err.message;
        reject(errors.internalError(err));
      });
    });
  });
};

/**
* @description get activities for a given <tt>School</tt> after validates the <tt>Token</tt>
* @param school_class {id} school_id or class_id
* @param rawToken {string}
* @param token {JSON}
* @return response {Promise} if successful, it returns an array of activities (<b>Array<activities></b>) inside response data.
*/
activities.getActivity = function(who, school_class, rawToken, token) {

  return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) reject(errors.invalidCredential("extraneous device"));
      if (who === "forSchool") {
        return activitiesDAO.readActivitiesForSchool(school_class)
        .then(function(activities){
          resolve(new response(200, activities, null));
        }).catch(function(err) {
          //var data = "Problem getting activities for Schools " + err.message;
          reject(errors.internalError(err));
        });
      } else if (who === "forClass") {
        return activitiesDAO.readActivitiesForClass(school_class)
        .then(function(activities){
          resolve(new response(200, activities, null));
        }).catch(function(err) {
          //var data = "Problem getting activities for Class " + err.message;
          reject(errors.internalError(err));
        });
      }
    });
  });
};
