/** @module business/students */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var studentsDAO = require('../persistence/students.js');
var credentialDAO = require('../persistence/credentials.js');
var errors = require('../mechanisms/error');
var students = {};

/** @method create
* @description something
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
students.create = function(profile, school_id, room_id, device, rawToken, token ) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return studentsDAO.create(profile, school_id, room_id)
      .then(function(student_id){
        resolve(new response(200, student_id, null));
      }).catch(function(err){
        reject(errors.internalError(err));
      });
    }).catch(function(err){
      //console.log(err.fields);
      //console.log(err.rows);
      reject(errors.internalError(err));
    });
  });
};

/** @method readForRoom
* @description find all students enrolled to a given room
* @param room_id {id} room that the students are enrolled
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
students.readForRoom = function(room_id, device, rawToken, token ) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return studentsDAO.findWithRoomId(room_id)
      .then(function(students){
        resolve(new response(200, students, null));
      }).catch(function(err){
        reject(errors.internalError(err));
      });
    }).catch(function(err){
      reject(errors.internalError(err));
    });
  });
};

/** @method readForGuardian
* @description something
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
students.readForGuardian = function(guardian_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){

    }).catch(function(err){
      reject(errors.internalError(err));
    });
  });
};
/** @method addForGuardian
* @description add a created student to a created guardian
* @param student_id {id}
* @param guardian_id {id}
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
students.addForGuardian = function(student_id, guardian_id, device, rawToken, token ) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){

    }).catch(function(err){
      reject(errors.internalError(err));
    });
  });
};
/** @method removeFromGuardian
* @description remove a student from a given guardian
* @param student_id {id}
* @param guardian_id {id}
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
students.removeFromGuardian = function(student_id, guardian_id, device, rawToken, token ) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){

    }).catch(function(err){
      reject(errors.internalError(err));
    });
  });
};
module.exports = students;
