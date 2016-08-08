/** @module business/students */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var studentsDAO = require('../persistence/students.js');
var guardiansDAO = require('../persistence/guardians.js');
var credentialDAO = require('../persistence/credentials.js');
var schoolsDAO = require('../persistence/schools.js');
var roomsDAO = require('../persistence/rooms.js'); 
var students = {};

/** @method create
* @description create students to a given room of a school
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
students.create = function(profile, school_id, room_id, device, rawToken, token ) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			return schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, school_id)
			.then(function(id){
        return studentsDAO.create(profile, school_id, room_id)
        .then(function(student_id){
          //console.log(student_id);
          resolve(responses.success(student_id));
        }).catch(function(err){
          resolve(responses.persistenceError(err));
        });
      }).catch(function(err){
        resolve(responses.invalidPermissions(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
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
      if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
			return roomsDAO.findWithEmployeeProfileAndRoomId(token.profile, room_id)
			.then(function(id){
        return studentsDAO.findWithRoomId(room_id)
        .then(function(students){
          resolve(responses.success(students));
        }).catch(function(err){
          resolve(responses.persistenceError(err));
        });
      }).catch(function(err){
        resolve(responses.invalidPermissions(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
  });
};

/** @method readForGuardian
* @description look up for all students of a given guardian
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return students {Array<Student>}
*/
students.readForGuardian = function(school_id, guardian_profile_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
      if (guardian_id === token.profile) { //guardian can take information about own kids
        return studentsDAO.findWithSchoolAndGuardianProfile(school_id, guardian_profile_id)
        .then(function(students){
          resolve(responses.success(students));
        }).catch(function(err){
          resolve(errors.internalError(err));
        });
      } else { //owner can take information about students of a guardian
        return schoolsDAO.findWithOwnerAndSchool(token.profile, school_id)
        .then(function(id){
          return studentsDAO.findWithSchoolAndGuardianProfile(school_id, guardian_profile_id)
          .then(function(students){
            resolve(responses.success(students));
          }).catch(function(err){
            resolve(errors.internalError(err));
          });
        }).catch(function(err){
          resolve(responses.invalidPermissions(err));
        });
      }
    }).catch(function(err){
      resolve(responses.persistenceError(err));
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
students.addForGuardian = function(school_id, student_profile_id, guardian_profile_id, device, rawToken, token ) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
      return schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, school_id)
      .then(function(id){

      }).catch(function(err){
        resolve(responses.invalidPermissions(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
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
students.removeFromGuardian = function(school_id, student_id, guardian_id, device, rawToken, token ) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if ((credential.device !== device)) resolve(responses.invalidParameters("device"));
      return schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, school_id)
      .then(function(id){

      }).catch(function(err){
        resolve(responses.invalidPermissions(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
  });
};
/** @method readWithProfileId
* @description read a student from profile_id
* @param student_profile_id {id}
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
*/
students.readWithProfileId = function(student_profile_id, device, rawToken, token ) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return studentsDAO.findWithProfileId(student_profile_id)
      .then(function(student){
        resolve(responses.success(student));
      }).catch(function(err){
        resolve(responses.persistenceError(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
  });
};


module.exports = students;
