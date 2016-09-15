/** @module business/posts */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var postsDAO = require('../persistence/posts.js');
var credentialDAO = require('../persistence/credentials.js');
var schoolsDAO = require('../persistence/schools.js');
var studentsDAO = require('../persistence/students.js');
var sns = require('../mechanisms/AWSSNS.js'); 
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
			if (credential.device !== device) resolve(responses.invalidParameters("device"));
			else schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, post.school_id)
			.then(function(resp) {
	      if (profiles.length > 0 ) {
					var done = 0;
					var returned = false;
					var validationThen = function(resp) {
						done ++;
						if (done === profiles.length && !returned) {
							returned = true;
							createThePost();
						}
					};
					var validationCatch = function(err) {
						if (!returned) {
							returned = true;
							resolve(responses.invalidPermissions(err));
						}
					};
	        var createThePost = function() {
		        postsDAO.createWithProfiles(post, author_id, profiles)
		        .then(function(result){
							posts.notifyTargetsOfPost(result.post.id);
		          resolve(responses.success(result));
		        }).catch(function(err){
		          resolve(responses.persistenceError(err));
		        });
					};
					
					for (var i in profiles) {
						studentsDAO.findWithSchoolAndStudentProfile(post.school_id, profile[i])
						.then(validationThen)
						.catch(validationCatch);
					}
	      } else {
					resolve(responses.invalidParameters("profiles"));
					return; 
	      }
			}).catch(function(err) {
				resolve(responses.invalidPermissions(err));
			});
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
			if (credential.device !== device) resolve(responses.invalidParameters("device"));
      else if (profiles.length > 0 ) {
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

posts.readForSchoolAndProfile = function(query, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
		return credentialDAO.read(rawToken)
		.then(function(credential){
			if (credential.device !== device) resolve(responses.invalidParameters("device"));
			else schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, query.school_id)
			.then(function(resp) {
				if(query.type !== undefined) {
					postsDAO.findPostsWithProfileAndSchoolAndType(query)
					.then(function(result){
						resolve(responses.success(result));
					}).catch(function(err){
						resolve(responses.persistenceError(err));
					});
				} else {
					postsDAO.findPostsWithProfileAndSchool(query)
					.then(function(result){
						resolve(responses.success(result));
					}).catch(function(err){
						resolve(responses.persistenceError(err));
					});
				}
			}).catch(function(err) {
				resolve(responses.invalidPermissions(err));
			});
		}).catch(function(err){
			resolve(responses.persistenceError(err));
		});
	});
};

posts.readForProfile = function(query, device, rawToken, token) {
  return new Promise(function(resolve, reject) {
    return credentialDAO.read(rawToken)
    .then(function(credential){
			if (credential.device !== device) resolve(responses.invalidParameters("device"));
			else studentsDAO.findWithGuardianProfileAndStudentProfile(token.profile, query.profile_id)
			.then(function(resp) {
	      postsDAO.findPostsWithProfileId(query)
	      .then(function(result){
	        resolve(responses.success(result));
	      }).catch(function(err){
	        resolve(responses.persistenceError(err));
	      });
			}).catch(function(err) {
				resolve(responses.invalidPermissions(err));
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

posts.notifyTargetsOfPost = function(post_id) {
	postsDAO.getPostTargets(post_id)
	.then(function(targets) {
		var findThen = function(devices) {
			sns.notifyNewPostToDevices(devices, "Voce tem um novo post.")
			.then(function(resp) {
				console.log(resp);
			}).catch(function(err) {
				console.log(err);
			});
		};
		var findCatch = function(err) {
			console.log("ERR>>",err);
		};
		for (var i in targets) {
			credentialDAO.findNotificationIDForStudentsGuardians(targets[i])
			.then(findThen)
			.catch(findCatch);
		};
	}).catch(function(err) {
		console.log("ERR>>",err);
	}) 
}




module.exports = posts;
