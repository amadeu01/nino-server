/** @module business/profiles */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var activitiesDAO = require('../persistence/profiles.js');
var profiles = {};
