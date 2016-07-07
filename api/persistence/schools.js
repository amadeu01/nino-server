/** @module persistence */

//var models = require('../models');

//var errors = require('../services/errors');

var validator = require('validator');
//var permissions = require('../services/permissions');
var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/**
* @class
*/
var schoolServices = {
	/**
	 * @method create
	 * @description Creates a new school with profile.id as owner
	 * @param school {School}
	 * @param profile {Profile}
	 * @return promise {Promise}
	 */
	create: function(school, profile) {
		//TODO: aqui eu vou criar a escola
		//TODO; preciso botar campo de active das coisas do DB :O
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res,rej) {
						var response = {}
						client.query('INSERT INTO schools (owner, notificationGroup, address, cnpj, telephone, email, name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',[profile.id, school.notificationGroup, school.address, school.cnpj, school.telephone, school.email, school.name], function(err, result) {
							if (err) rej(err); //Error, reject to BO
							else if (result.rowCount == 0) rej(result); //Reject here - will stop transaction
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else {
								response.school = result.rows[0];
								res(response);	//Proceed to commit transaction
							}
						});
					});
				}).then(function(response) {
					return new Promise(function(res,rej) {
						client.query('INSERT INTO employees (profile, school) VALUES ($1, $2) RETURNING id',[profile.id, response.school.id], function(err, result) {
							if (err) rej(err); //Error, reject to BO
							else if (result.rowCount == 0) rej(result); //Reject here - will stop transaction
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else {
								response.employee = result.rows[0];
								res(response);	//Proceed to commit transaction
							} 
						});
					});
				}).then(function(response) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve(response); //Resolves created to BO
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
						reject(err2);
					});
				});
			});
		});
	},
	findWithId: function(id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT name, email, telephone FROM schools WHERE id = $1', [id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount == 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows[0]); //Executed correctly
				});
			});
		});
	}
};

module.exports = schoolServices;
