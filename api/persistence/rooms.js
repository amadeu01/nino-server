/** @module persistence */


var models = require('../models');

//errors and validator's module
var errors = require('../mechanisms/error');
var validator = require('validator');

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/** @method create
 * @param email {string}
 * @return Promise {Promise}
 */
var roomServices = {
	create: function(room, _class) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Error, reject to BO
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res,rej) {
						client.query('INSERT INTO rooms (name, class, notificationGroup) VALUES ($1, $2, $3) RETURNING id',[room.name, _class.id, room.notificationGroup], function(err, result) {
							if (err) rej(err); //Error, reject to BO
							else if (result.rowCount == 0) rej(result); //Nothing inserted, rejects so BO can handle
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else res(result);	//Proceed to commit transaction
						});
					});
				}).then(function(result) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve({room:result.rows[0]}); //Returns to BO
					}).catch(function(err) {
						done(err);
						reject(err); //Rejects to BO
					});
				}).catch(function(err) {
					return transaction.abort(client)
					.then(function() {
						done();
						reject(err); //Rejects the error
					}).catch( function(err2) {
						done(err2);
						reject(err2); //Rejects other error
					});
				});
			});
		});
	},
	findWithClassId: function(classID) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT id, name FROM rooms WHERE class = $1', [classID], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount == 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Executed correctly
				});
			});
		});
	}
};

module.exports = roomServices;
