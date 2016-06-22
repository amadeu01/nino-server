/** @module business/posts */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var activitiesDAO = require('../persistence/posts.js');
var posts = {};
