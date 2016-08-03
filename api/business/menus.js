/** @module business/menus */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var menuDAO = require('../persistence/menus.js');
var credentialDAO = require('../persistence/credentials.js');
var menus = {};

module.exports = menus;
