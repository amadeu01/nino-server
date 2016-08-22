/** @module business/posts */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var postsDAO = require('../persistence/posts.js');
var credentialDAO = require('../persistence/credentials.js');
var posts = {};

/** @method create
 * @param device {string}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return promise {Promise} returns posts' id and author's id
 */
posts.create = function(post, author_id, profiles, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (profiles.length > 0 ) {
        return postsDAO.createWithProfiles(post, author_id, profiles)
        .then(function(result){
          resolve(responses.success(result));
        }).catch(function(err){
          resolve(responses.persistenceError(err));
        });
      } else {
		resolve(responses.invalidParameters("profiles"));
		return; 
      }
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
  });
};

/** @method update
 * @param device {string}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return promise {Promise} returns posts' id and author's id
 */
posts.update = function(post, author_id, profiles, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      if (profiles.length > 0 ) {
        return postsDAO.updateWithProfiles(post, author_id, profiles)
        .then(function(result){
          resolve(responses.success(result));
        }).catch(function(err){
          resolve(responses.persistenceError(err));
        });
      } else {
        return postsDAO.update(post, author_id)
        .then(function(result){
          resolve(responses.success(result));
        }).catch(function(err){
          resolve(responses.persistenceError(err));
        });
      }
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
  });
};
/** @method delete
 * @param post_id {id}
 * @param author_id {id}
 * @param profiles {Array<Profiles>}
 * @param device {string}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return promise {Promise} returns posts' id and author's id
 */
posts.delete = function(post_id, author_id, profiles, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return postsDAO.delete(post_id, author_id)
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
/** @method readForProfile
 * @param school_id {id}
 * @param profile_id {id}
 * @param device {string}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return promise {Promise} returns posts' id and author's id
 */
posts.readForProfile = function(school_id, profile_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return postsDAO.findPostsWithProfileId(profile_id)
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

/** @method readForRoom
 * @param school_id {id}
 * @param room_id {id}
 * @param device {string}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return promise {Promise} returns posts' id and author's id
 */
posts.readForRoom = function(school_id, room_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return postsDAO.findPostsWithRoomId(room_id)
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

/** @method readForClass
 * @param school_id {id}
 * @param class_id {id}
 * @param device {string}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return promise {Promise} returns posts' id and author's id
 */
posts.readForClass = function(school_id, class_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return postsDAO.findPostsWithClassId(class_id)
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

/** @method readForAuthor
 * @param school_id {id}
 * @param author_id {id}
 * @param device {string}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return promise {Promise} returns posts' id and author's id
 */
posts.readForAuthor = function(school_id, author_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return postsDAO.findPostsWithAuthorId(author_id)
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

/** @method whoHasRead
 * @param school_id {id}
 * @param author_id {id}
 * @param device {string}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return promise {Promise} returns posts' id and author's id
 */
posts.whoHasRead = function(school_id, post_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return postsDAO.getPostReadByInfo(post_id)
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

/** @method markWhoRead
 * @param school_id {id}
 * @param author_id {id}
 * @param reader_profile_id {id}
 * @param device {string}
 * @param rawToken {string} helps find user credential
 * @param token {JSON} all information decoded
 * @return promise {Promise} returns posts' id and author's id
 */
posts.markWhoRead = function(school_id, post_id, reader_profile_id, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
      return postsDAO.markPostAsReadBy(reader_profile_id, post_id)
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




module.exports = posts;
