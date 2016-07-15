/** @module business/posts */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var postsDAO = require('../persistence/posts.js');
var posts = {};

module.exports = posts;
