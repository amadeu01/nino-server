/** @module business/educators */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var credentialDAO = require('../persistence/credentials.js');
var employeesDAO = require('../persistence/employees.js');
var errors = require('../mechanisms/error');
var educators = {};

/** @method addEducatorToSchool
 * @description something
 * @param school_id {id}
 * @param profile_id {id}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.addEducatorToSchool = function(school_id, profile_id, rawToken, token) {
  new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      return employeesDAO.read(profile_id)
      .then(function(educator){
        return employeesDAO.addEducatorToSchool(school_id, profile_id)
        .then(function(result){
          resolve(new response(200, result, null));
        }).catch(function(err){
          reject(errors.internalError(err));
        });
      });
    }).catch(function(err){
      reject(errors.internalError(err));
    });
  });
};

/** @method getEducatorForSchool
 * @description something
 * @param school_id {id}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.getEducatorForSchool = function(school_id, rawToken, token) {
  new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      //TODO: there is permition ?
      return employeesDAO.readFromSchool(school_id)
      .then(function(educators) {
        resolve(new response(200, educators, null));
      }).catch(function(err){
        reject(errors.internalError(err));
      });
    });
  });
};

/** @method getEducatorForRoom
 * @description something
 * @param school_id {id}
 * @param class_id {id}
 * @param room_id {id}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.getEducatorForRoom = function(school_id, class_id, room_id, rawToken, token) {
  new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      //TODO: there is permition ?
      return employeesDAO.readFromRoom(school_id, class_id, room_id)
      .then(function(educators) {
        resolve(new response(200, educators, null));
      }).catch(function(err){
        reject(errors.internalError(err));
      });
    });
  });
};

/** @method removeEducatorFromSchool
 * @description Remove <tt>Educator</tt> from school
 * @param school_id {id}
 * @param profile_id {id} educators profile
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.removeEducatorFromSchool = function(school_id, profile_id, rawToken, token) {
  new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      //TODO: there is permition ?
      return employeesDAO.removeEducator(school_id, profile_id)
      .then(function(educator) {
        resolve(new response(200, educator, null));
      }).catch(function(err){
        reject(errors.internalError(err));
      });
    });
  });
};
module.exports = educators;
