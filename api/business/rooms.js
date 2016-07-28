/** @module business/rooms */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var roomsDAO = require('../persistence/rooms.js');
var credentialDAO = require('../persistence/credentials.js');
var schoolsDAO = require('../persistence/schools.js');
var rooms = {};


/** @method createToClass
* @param room {JSON} <b>Model</b> ``` room = {name: room_name} ```
* @param class_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.createToClass = function(school_id, room, class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) resolve(responses.invalidParameters("device"));
      return schoolsDAO.findWithOwnerAndSchool(token.profile, school_id)
      .then(function(ids){
        return roomsDAO.create(room, class_id)
        .then(function(room_id){
          resolve(responses.success(room_id));
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

/** @method getRoomFromClass
* @param class_id {id}
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.getRoomFromClass = function(school_id, class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) resolve(responses.invalidParameters("device"));
      return schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, school_id)
      .then(function(ids){
        return roomsDAO.findWithClassId(class_id)
        .then(function(rooms){
          resolve(responses.success(rooms));
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

/** @method addStudentToRoom
* @param student_id {id}
* @param room_id {id}
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.addStudentToRoom = function(school_id, student_id, room_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) resolve(responses.invalidParameters("device"));
      return schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, school_id)
      .then(function(ids){
        return roomsDAO.addStudent(student_id, room_id)
        .then(function(result){
          resolve(responses.success(result));
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

/** @method removeStudentFromRoom
* @param student_id {id}
* @param room_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.removeStudentFromRoom = function(school_id, student_id, room_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) resolve(responses.invalidParameters("device"));
      return schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, school_id)
      .then(function(ids){
        return roomsDAO.removeStudent(student_id, room_id)
        .then(function(result){
          resolve(responses.success(result));
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

/** @method addEducatorToRoom
* @param educator_id {id}
* @param room_id {id}
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.addEducatorToRoom = function(school_id, educator_id, room_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) resolve(responses.invalidParameters("device"));
      return schoolsDAO.findWithOwnerAndSchool(token.profile, school_id)
      .then(function(ids){
        return roomsDAO.addEducator(educator_id, room_id)
        .then(function(result){
          resolve(responses.success(result));
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

/** @method removeEducatorFromRoom
* @param educator_id {id}
* @param room_id {id}
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.removeEducatorFromRoom = function(school_id, educator_id, room_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) resolve(responses.invalidParameters("device"));
      return schoolsDAO.findWithOwnerAndSchool(token.profile, school_id)
      .then(function(id){
        return roomsDAO.removeEducator(educator_id, room_id)
        .then(function(result){
          resolve(responses.success(result));
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

/** @method update
* @param roomInfo {JSON}
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.update = function(school_id, roomInfo, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) resolve(responses.invalidParameters("device"));
      return schoolsDAO.findWithOwnerAndSchool(token.profile, school_id)
      .then(function(id){
        return roomsDAO.update(roomInfo)
        .then(function(result){
          resolve(responses.success(result));
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

/** @method delete
* @param room_id {id}
* @param class_id {id}
* @param device {string}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.delete = function(school_id, room_id, class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (credential.device !== device) resolve(responses.invalidParameters("device"));
      return schoolsDAO.findWithOwnerAndSchool(token.profile, school_id)
      .then(function(id){
        return roomsDAO.delete(room_id)
        .then(function(result){
          resolve(responses.success(result));
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

module.exports = rooms;
