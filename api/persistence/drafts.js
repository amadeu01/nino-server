/**
* @author Carlos Millani
* @module persistence
*/

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

var drafts = {};

module.exports = drafts;
