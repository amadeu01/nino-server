/** @module business/employees */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var credentialDAO = require('../persistence/credentials.js');
var employeesDAO = require('../persistence/employees.js');
var errors = require('../mechanisms/error');
var uid = require('uid-safe');
var educators = {};

/** @method addEducatorToSchool
 * @description something
 * @param school_id {id}
 * @param profile_id {id}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 * @deprecated old educators method
 */
educators.addEducatorToSchool = function(school_id, profile_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      return employeesDAO.addEducatorToSchool(school_id, profile_id)
      .then(function(result){
        resolve(new response(200, result, null));
      }).catch(function(err){
        reject(errors.internalError(err));
      });
    });
  });
};

/** @method addEmployeeToSchool
 * @description something
 * @param school_id {id}
 * @param profile_id {id}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.addEmployeeToSchool = function(school_id, profile_id, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      return employeesDAO.addEmployeeToSchool(school_id, profile_id)
      .then(function(result){
        resolve(new response(200, result, null));
      }).catch(function(err){
        reject(errors.internalError(err));
      });
    });
  });
};

/** @method createEmployee
 * @description something
 * @param school_id {id}
 * @param account {JSON}
 * @param profile {JSON}
 * @param device {String}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.createEmployee = function(school_id, account, profile, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      account.hash = uid.sync(100);
      return employeesDAO.create(school_id, account, profile)
      .then(function(result){
        resolve(new response(200, result, null));
      }).catch(function(err){
        reject(errors.internalError(err));
      });
    });
  });
};

/** @method createEducator
 * @description something
 * @param school_id {id}
 * @param account {JSON}
 * @param profile {JSON}
 * @param device {String}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.createEducator = function(school_id, profile, account, device, rawToken, token) {
  //console.log("In BO");
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      account.hash = uid.sync(100);
      return employeesDAO.createEducator(school_id, account, profile)
      .then(function(result){
        resolve(new response(200, result, null));
      }).catch(function(err){
        reject(errors.internalError(err));
      });
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
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      //TODO: there is permition ?
      return employeesDAO.getEmployeesWithSchoolId(school_id)
      .then(function(educators) {
        resolve(new response(200, educators, null));
      }).catch(function(err){
        reject(errors.internalError(err));
      });
    });
  });
};

/** @method getEmployeeForSchool
 * @description something
 * @param school_id {id}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.getEmployeesForSchool = function(rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      //TODO: there is permition ?
      return employeesDAO.getEmployeesWithSchoolId(token.school)
      .then(function(employees) {
        resolve(new response(200, employees, null));
      }).catch(function(err){
        reject(errors.internalError(err));
      });
    });
  });
};

/** @method getEmployeeForSchool
 * @description something
 * @param school_id {id}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.getEmployeeWithProfile = function(profile_id, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      //TODO: there is permition ?
      return employeesDAO.findWithProfileId(profile_id)
      .then(function(employee) {
        resolve(new response(200, employee, null));
      }).catch(function(err){
        resolve(errors.persistenceError(err));
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
  return new Promise(function(resolve, reject){
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
/** @method updateEducatorFromSchool
 * @description Update <tt>Educator</tt> info
 * @param school_id {id}
 * @param profile_id {id} educators profile
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return response {Promise}
 */
educators.updateEmployeeFromSchool = function(school_id, accountInfo, profileInfo, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      //TODO: validate token information
      //TODO: there is permition ?
      return employeesDAO.update(school_id, account, profile)
      .then(function(educator) {
        resolve(new response(200, educator, null));
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
educators.removeEmployeeFromSchool = function(school_id, profile_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
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
