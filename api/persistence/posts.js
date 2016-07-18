/**
* @module persistence
*/

var models = require('../models');

//errors and validator's module
var errors = require('../mechanisms/error');
var validator = require('validator');
var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/**
* @class
*/
var postsDAO = {
 /** @method create
  * @description Create a new <tt>Profile</tt> and links it to a new <tt>Account</tt>. Initiates transaction and creates new entities, linking them
  * @param post {Account} - Message, school, class, room, type
  */
	create: function(post) {
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res, rej) {
						client.query('INSERT INTO posts (message, school, class, room, type) VALUES ($1, $2, $3, $4, $5) RETURNING id', [post.message, post.school, post.class, post.room, post.type], function(err, result) {
							if (err) rej (err);
							else if (result.rowCount === 0) rej (result); //Reject here - will stop transaction
							else if (result.name == 'error') rej(result); //Some error occured : rejects
							else res(result);
						});
					});
				}).then(function(result) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve(result); //Success! Resolve to BO
					}).catch(function(err) {
						done(err);
						reject(err); //Reject other to BO
					});
				}).catch(function (err) {
					return transaction.abort(client)
					.then(function() {
						done();
						reject(err); //Successfully aborted, rejects to BO
					}).catch(function(err2) {
						done(err2);
						reject(err2); // Reject another error to BO
					});
				});
			});
		});
	}
}

module.exports = postsDAO;
