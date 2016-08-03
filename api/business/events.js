/** @module business/events */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var eventsDAO = require('../persistence/events.js');
var credentialDAO = require('../persistence/credentials.js');
var events = {};

module.exports = events;
