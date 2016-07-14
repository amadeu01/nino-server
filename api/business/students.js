/** @module business/students */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var studentsDAO = require('../persistence/students.js');
var credentialDAO = require('../persistence/credentials.js');
var errors = require('../mechanisms/error');
var students = {};

/** @method
* @description something
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

/** @method
* @description something
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
students.readForGuardian = function(student, guardian, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){

    }).catch(function(err){
      reject(errors.internalError(err));
    });
  });
};
/** @method
* @description something
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
students.addForGuardian = function(student, guardian, device, rawToken, token ) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){

    }).catch(function(err){
      reject(errors.internalError(err));
    });
  });
};
/** @method
* @description something
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
students.removeFromGuardian = function(student, guardian, device, rawToken, token ) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){

    }).catch(function(err){
      reject(errors.internalError(err));
    });
  });
};
module.exports = students;
