/**
* @module persistence
*/

var models = require('../models');

//errors and validator's module
var errors = require('../services/errors');
var validator = require('validator');

/**
* @class
*/
var postsServices = {
	create: function(parameters) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    return models.waterline.collections.post.create({
      attachment: parameters.attachment,
      message: parameters.message,
      date: parameters.date,
      type: parameters.type,
      school: parameters.school
    }).then(function(post){
      if (!post) throw errors.internalError('Posts - Creation Error');
      return ({post: post.id});
    });
	},
	delete: function(parameters) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    return models.waterline.collections.post.findOne(parameters)
    .then(function(post){
      if (!post) throw errors.inexistentRegister('Posts - Finding Error');
      post.active = false;
      return post.save();
    });
	},
	update: function(parameters, newParatemers) {
    if (!parameters || !newParatemers) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
    return models.waterline.collections.post.update(parameters, newParatemers)
    .then(function(posts){
      if (!posts) throw errors.inexistentRegister('Posts - Finding Error');
      return posts;
    });
	},
	read: function(parameters) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
		return models.waterline.collections.post.findOne(parameters)
    .then(function(post){
      if (!post) throw errors.inexistentRegister('Posts - Finding Error');
      return post;
    });
	},
  addEducator: function(parameters, educator_id) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
		return models.waterline.collections.post.findOne(parameters).populate('educators')
    .then(function(post){
      if (!post) throw errors.inexistentRegister('Posts - Finding Error');
      post.educators.add(educator_id);
      return post.save();
    });
  },
  addStudent: function(parameters, student_id) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
		return models.waterline.collections.post.findOne(parameters).populate('students')
    .then(function(post){
      if (!post) throw errors.inexistentRegister('Posts - Finding Error');
      post.students.add(student_id);
      return post.save();
    });
  }
};

module.exports = postsServices;
