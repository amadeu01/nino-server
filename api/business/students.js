/** @module business/students */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var activitiesDAO = require('../persistence/students.js');
var students = {};
