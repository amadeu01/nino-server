/** @module business/activities */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var activitiesDAO = require('../persistence/activities.js');
var jwt = require('../mechanisms/jwt.js')
var activities = {};

/**
* @description
* @param School {id}
* @param Description {string}
* @param token {string}
* @return activity {id}
*/
activities.createActivityToSchool = function(school, description, token ) {
  return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) reject(new response(400),'email',1);
		return (jwt.validate(token, school))
		.then (function (decoded) {
			activitiesDAO.createActivityToSchool(school, description)
			.then(function(response) {
				resolve(response);
			}).catch(function(err) {
				reject(err);
			});
		}); //TODO: faltou parenteses de novo hahaha lembra de testar cara :)
	});
}

/**
* @description Add activity to the current class in process
* @param School {id}
* @param activity {id}
* @param token {string}
* @return activity {JSON}
*/
activities.addActivityToClass = function(school, activity, _class, token) { //TODO: aqui o class é palavra reservada D: ele serve como campo de um objeto mas nao como variavel pelo que parece... assim vai rodar :)
  return new Promise(function(resolve, reject) {
    return jwt.validate(token, school).then(function(decoded){

    })
  }).then(function(classes){
    resolve(response);
  }).catch(function(err) {
    reject(err);
  });
}

/**
* @description
* @param School {id}
* @param Description {string}
* @param token {string}
* @return activity {id}
*/
activities.getActivityForSchool = function() {

}

/**
* @description
* @param School {id}
* @param Description {string}
* @param token {string}
* @return activity {id}
*/
activities.getActivityForClass = function() {

}
