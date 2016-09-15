/** @module business/drafts */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var activitiesDAO = require('../persistence/drafts.js');
var schoolsDAO = require('../persistence/schools.js');
var studentsDAO = require('../persistence/students.js');
var credentialDAO = require('../persistence/credentials.js');
var draftsDAO = require('../persistence/drafts.js');
var postsBO = require('../business/posts.js');
var drafts = {};

drafts.create = function(draft, author_id, profiles, device, rawToken, token) {
  return new Promise(function(resolve, reject){
    return credentialDAO.read(rawToken)
    .then(function(credential){
			if (credential.device !== device) resolve(responses.invalidParameters("device"));
			else schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, draft.school)
				//TODO validate profiles
			.then(function(resp) {
	      if (profiles.length > 0 ) {
					var done = 0;
					var returned = false;
					var validationThen = function(resp) {
						done ++;
						if (done === profiles.length && !returned) {
							returned = true;
							createTheDraft();
						}
					};
					var validationCatch = function(err) {
						if (!returned) {
							returned = true;
							resolve(responses.invalidPermissions(err));
						}
					};
	        var createTheDraft = function() {
						draftsDAO.createWithProfiles(draft, author_id, profiles)
		        .then(function(result){
		          resolve(responses.success(result));
		        }).catch(function(err){
		          resolve(responses.persistenceError(err));
		        });
					}
					
					for (var i in profiles) {
						studentsDAO.findWithSchoolAndStudentProfile(draft.school, profiles[i])
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

drafts.findWithProfileAndSchool = function(query, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
    credentialDAO.read(rawToken)
    .then(function(credential){
			if (credential.device !== device) resolve(responses.invalidParameters("device"));
			else schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, query.school_id)
			.then(function(resp) {
				if(query.type !== undefined) {
					draftsDAO.findWithProfileAndSchoolAndType(query)
					.then(function(resp) {
						resolve(responses.success(resp));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
				} else {
					draftsDAO.findWithProfileAndSchool(query)
					.then(function(resp) {
						resolve(responses.success(resp));
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					});
				}
			}).catch(function(err) {
				resolve(responses.invalidPermissions(err));
			})
    }).catch(function(err){
      resolve(responses.persistenceError(err));
    });
	});
};

drafts.updateDraft = function(draft_id, new_draft, school_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
    		credentialDAO.read(rawToken)
    		.then(function(credential){
			if (credential.device !== device) resolve(responses.invalidParameters("device"));
			else schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, school_id)
			.then(function(resp) {
				draftsDAO.updateDraft(draft_id, new_draft, school_id, token.profile)
				.then(function(resp) {
					resolve(responses.success(resp));
				}).catch(function(err) {
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

drafts.postDraft = function(draft_id, school_id, device, rawToken, token) {
	return new Promise(function(resolve, reject) {
    credentialDAO.read(rawToken)
    .then(function(credential){
			if (credential.device !== device) resolve(responses.invalidParameters("device"));
			else schoolsDAO.findWithEmployeeProfileAndSchool(token.profile, school_id)
			.then(function(resp) {
				draftsDAO.postDraft(draft_id, school_id)
				.then(function(resp) {
					postsBO.notifyTargetsOfPost(resp.post.id);
					resolve(responses.success(resp));
				}).catch(function(err) {
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

module.exports = drafts;
