/** @module business/rooms */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var roomsDAO = require('../persistence/rooms.js');
var credentialDAO = require('../persistence/credentials.js');
var errors = require('../mechanisms/error');
var rooms = {};
