/** @module persistence */


var models = require('../models');

//errors and validator's module
var errors = require('../mechanisms/error');
var validator = require('validator');

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/**
* @class
*/
var classServices = {
	/** 
	 * @method create
	 * @description Adds a new Classroom with provided _class to the School school.id
	 * @param school {School}
	 * @param _class {Class}
	 * @return id {Int}
	 */
	create: function(_class, school) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res,rej) {
						client.query('INSERT INTO classes (name, school, menu) VALUES ($1, $2, $3) RETURNING id',[_class.name, school.id, _class.menu], function(err, result) {
							if (err) rej(err);
							else if (result.rowCount == 0) rej(new Error("Class not created"));
							else res(result);	
						});
					});
				}).then(function(result) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve(result.rows[0]);
					}).catch(function(err) {
						done(err);
						reject(err);
					});
				}).catch(function(err) {
					return transaction.abort(client)
					.then(function() {
						done();
						reject(err);
					}).catch( function(err2) {
						done(err2);
						reject(err);
					});
				});
			});
		});
	},
	/**
	* Read
	*/
	read: {

	},

	/**
	* Update
	*/
	update: {

	},
	/**
	* Delete
	*/
	delete: {

	}
};

module.exports = classServices;
