/** @module business/activities */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var activitiesDAO = require('../persistence/activities.js');
var activities = {};
