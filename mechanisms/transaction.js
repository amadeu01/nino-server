/**
* @author Carlos Millani
* @module mechanisms
*/

var Waterline = require('waterline');

var transaction = {};

/**
* Start
*/
transaction.start = function(client) {
	return new Promise(function(resolve, reject) {
		client.query('BEGIN', function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
};

/**
* Commit
*/
transaction.commit = function(client) {
	return new Promise(function(resolve, reject) {
		client.query('COMMIT', function(err) { 
			if (err) reject(err);
			else resolve();
		});
	});
};

/**
* Abort
*/
transaction.abort = function(client) {
	return new Promise(function(resolve, reject) {
		client.query('ROLLBACK', function(err) { 
			if (err) reject(err);
			else resolve();
		});
	});
};

module.exports = transaction;
