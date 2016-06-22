/** @module business/guardians */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var activitiesDAO = require('../persistence/guardians.js');
var guardians = {};
