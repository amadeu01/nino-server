/** @module business/rooms */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var roomsDAO = require('../persistence/rooms.js');
var credentialDAO = require('../persistence/credentials.js');
var errors = require('../mechanisms/error');
var rooms = {};


/** @method createToClass
* @param room {JSON} <b>Model</b> ``` room = {name: room_name} ```
* @param
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.createToClass = function(room, class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.create(room, class_id)
      .then(function(room_id){
        resolve(new response(200, room_id, null));
      }).catch(function(err){
        reject(errors.internalError("database:Room"));
      });
    }).catch(function(err){
      reject(errors.internalError("database:Credential"));
    });
  });
};

/** @method getRoomFromClass
* @param class_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.getRoomFromClass = function(class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.findWithClassId(class_id)
      .then(function(rooms){
        resolve(new response(200, rooms, null));
      }).catch(function(err){
        reject(errors.internalError("database:Room"));
      });
    }).catch(function(err){
      reject(errors.internalError("database:Credential"));
    });
  });
};

/** @method addStudentToRoom
* @param student_id {id}
* @param class_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.addStudentToRoom = function(student_id, class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.addStudent(student_id, class_id)
      .then(function(result){
        resolve(new response(200, result, null));
      }).catch(function(err){
        reject(errors.internalError("database:Room"));
      });
    }).catch(function(err){
      reject(errors.internalError("database:Credential"));
    });
  });
};

/** @method removeStudentFromRoom
* @param student_id {id}
* @param class_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.removeStudentFromRoom = function(student_id, class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.removeStudent(student_id, class_id)
      .then(function(result){
        resolve(new response(200, result, null));
      }).catch(function(err){
        reject(errors.internalError("database:Room"));
      });
    }).catch(function(err){
      reject(errors.internalError("database:Credential"));
    });
  });
};

/** @method addEducatorToRoom
* @param educator_id {id}
* @param class_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.addEducatorToRoom = function(educator_id, class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.addEducator(educator_id, class_id)
      .then(function(result){
        resolve(new response(200, result, null));
      }).catch(function(err){
        reject(errors.internalError("database:Room"));
      });
    }).catch(function(err){
      reject(errors.internalError("database:Credential"));
    });
  });
};

/** @method removeEducatorFromRoom
* @param educator_id {id}
* @param class_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.removeEducatorFromRoom = function(educator_id, class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.removeEducator(educator_id, class_id)
      .then(function(result){
        resolve(new response(200, result, null));
      }).catch(function(err){
        reject(errors.internalError("database:Room"));
      });
    }).catch(function(err){
      reject(errors.internalError("database:Credential"));
    });
  });
};

/** @method update
* @param roomInfo {JSON}
* @param class_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.update = function(roomInfo, class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.create(roomInfo, class_id)
      .then(function(result){
        resolve(new response(200, result, null));
      }).catch(function(err){
        reject(errors.internalError("database:Room"));
      });
    }).catch(function(err){
      reject(errors.internalError("database:Credential"));
    });
  });
};

module.exports = rooms;
