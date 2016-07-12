/** @module business/events */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var eventsDAO = require('../persistence/events.js');
var credentialDAO = require('../persistence/credentials.js');
var errors = require('../mechanisms/error');
var events = {};
