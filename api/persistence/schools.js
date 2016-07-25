/** @module persistence/schools */

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
	 * @param profile {id}
	 * @return promise {Promise} resolves to new School and employee <p><b>Model</b> ``` {"school":{"id":1},"employee":{"id":1}}```
	 */
	create: function(school, profile_id) {
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
						var response = {};
						client.query('INSERT INTO schools (owner, notificationGroup, address, cnpj, telephone, email, name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',[profile_id, school.notificationGroup, school.address, school.cnpj, school.telephone, school.email, school.name], function(err, result) {
							if (err) rej(err); //Error, reject to BO
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else {
								response.school = result.rows[0];
								res(response);	//Proceed to commit transaction
							}
						});
					});
				}).then(function(response) {
					return new Promise(function(res,rej) {
						client.query('INSERT INTO employees (profile, school) VALUES ($1, $2) RETURNING id',[profile_id, response.school.id], function(err, result) {
							if (err) rej(err); //Error, reject to BO
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else {
								//response.employee = result.rows[0];
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
	
 /** @method findWithProfileId
  * @description Finds a school with a given Profile ID
  * @param profile_id {int}
  * @return list of [id, name, email, telephone, address] from school {[School]}
  */
	findWithProfileId: function(profile_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT s.id, s.name, s.email, s.telephone, s.address FROM schools s, profiles p, employees e WHERE s.id = e.school AND e.profile = p.id AND p.id = $1', [profile_id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Executed correctly
					done();
				});
			});
		});
	},
	
 /** @method findWithId
  * @description Finds a school with detemined ID
  * @param id {int}
  * @return name, email, telephone, address from school {School}
  */
	findWithId: function(id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT name, email, telephone, address FROM schools WHERE id = $1', [id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows[0]); //Executed correctly
					done();
				});
			});
		});
	},
	/** @method findWithOwnerAndSchool
   * @description Finds a school with owner and school id
   * @param id {int}
   * @return schoo_id {id}
   */
	findWithOwnerAndSchool: function(profile_id, school_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT id FROM schools WHERE id = $1 AND owner = $2', [school_id, profile_id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows[0]); //Executed correctly
					done();
				});
			});
		});
	},

	findWithEmployeeProfileAndSchool: function(profile_id, school_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT e.profile, s.id FROM schools s, employees e, profiles p WHERE e.school = s.id AND e.profile = p.id AND s.id = $1 AND p.id = $2', [school_id, profile_id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows[0]); //Executed correctly
					done();
				});
			});
		});
	}
};

module.exports = schoolServices;
