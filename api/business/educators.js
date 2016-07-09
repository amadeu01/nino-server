/** @module business/educators */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var credentialDAO = require('../persistence/credentials.js');
var employeesDAO = require('../persistence/employees.js');
var errors = require('../mechanisms/error');
var educators = {};

/** @method addEducatorToSchool
 * @description
 * @param school_id {id}
 * @param profile_id {id}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.addEducatorToSchool = function(school_id, profile_id, rawToken, token) {
  new Promise(function(resolve, reject){

  })
}

/** @method getEducatorForSchool
 * @description
 * @param school_id {id}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.getEducatorForSchool = function(school_id, rawToken, token) {

}

/** @method getEducatorForRoom
 * @description
 * @param school_id {id}
 * @param class_id {id}
 * @param room_id {id}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.getEducatorForRoom = function(school_id, class_id, room_id, rawToken, token) {

}

/** @method removeEducatorFromSchool
 * @description
 * @param school_id {id}
 * @param profile_id {id} educators profile
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.removeEducatorFromSchool = function(school_id, profile_id, rawToken, token) {

}
