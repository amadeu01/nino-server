/** @module business/rooms */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var activitiesDAO = require('../persistence/rooms.js');
var rooms = {};
