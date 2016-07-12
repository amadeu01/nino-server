/** @module business/menus */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var menuDAO = require('../persistence/menus.js');
var credentialDAO = require('../persistence/credentials.js');
var errors = require('../mechanisms/error');
var menus = {};
