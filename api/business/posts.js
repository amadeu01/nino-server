/** @module business/posts */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var postsDAO = require('../persistence/posts.js');
var posts = {};

module.exports = posts;
