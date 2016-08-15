/** @module persistence/agendas */

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

var agendas = {};

module.exports = agendas;
