/** @module business/rooms */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var roomsDAO = require('../persistence/rooms.js');
var credentialDAO = require('../persistence/credentials.js');
var rooms = {};


/** @method createToClass
* @param room {JSON} <b>Model</b> ``` room = {name: room_name} ```
* @param class_id {id}
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
        resolve(responses.success(room_id));
      }).catch(function(err){
        resolve(responses.persistenceError(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
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
        resolve(responses.success(rooms));
      }).catch(function(err){
        resolve(responses.persistenceError(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
  });
};

/** @method addStudentToRoom
* @param student_id {id}
* @param room_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.addStudentToRoom = function(student_id, room_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.addStudent(student_id, room_id)
      .then(function(result){
        resolve(responses.success(result));
      }).catch(function(err){
        resolve(responses.persistenceError(err));
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
rooms.removeStudentFromRoom = function(student_id, room_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.removeStudent(student_id, room_id)
      .then(function(result){
        resolve(responses.success(result));
      }).catch(function(err){
        resolve(responses.persistenceError(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
  });
};

/** @method addEducatorToRoom
* @param educator_id {id}
* @param room_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.addEducatorToRoom = function(educator_id, room_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.addEducator(educator_id, room_id)
      .then(function(result){
        resolve(responses.success(result));
      }).catch(function(err){
        resolve(responses.persistenceError(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
  });
};

/** @method removeEducatorFromRoom
* @param educator_id {id}
* @param room_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.removeEducatorFromRoom = function(educator_id, room_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.removeEducator(educator_id, room_id)
      .then(function(result){
        resolve(responses.success(result));
      }).catch(function(err){
        resolve(responses.persistenceError(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
  });
};

/** @method update
* @param roomInfo {JSON}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.update = function(roomInfo, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.update(roomInfo)
      .then(function(result){
        resolve(responses.success(result));
      }).catch(function(err){
        resolve(responses.persistenceError(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
  });
};

/** @method delete
* @param room_id {id}
* @param class_id {id}
* @param rawToken {string} helps find user credential
* @param token {JSON} all information decoded
* @return <p><b>Model</b> ```  ```
*/
rooms.delete = function(room_id, class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return roomsDAO.delete(room_id)
      .then(function(result){
        resolve(responses.success(result));
      }).catch(function(err){
        resolve(responses.persistenceError(err));
      });
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
  });
};

module.exports = rooms;
