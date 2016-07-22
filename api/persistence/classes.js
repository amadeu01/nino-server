/** @module persistence/classes */

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/**
* @class
*/
var classServices = {
	/**
	 * @method create
	 * @description Adds a new Classroom with provided _class to the School school.id
	 * @param school {id}
	 * @param _class {Class}
	 * @return id {Int}
	 */
	create: function(_class, school_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Error, reject to BO
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res,rej) {
						client.query('INSERT INTO classes (name, school, menu) VALUES ($1, $2, $3) RETURNING id',[_class.name, school_id, _class.menu], function(err, result) {
							if (err) rej(err); //Error, reject to BO
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else res(result);	//Proceed to commit transaction
						});
					});
				}).then(function(result) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve({class: result.rows[0]}); //Returns to BO
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
/** @method findWithSchoolId
 * @param school_id {id}
 * @return Promise {Promise} Resolves to class with id name and menu.id(?)
 */
	findWithSchoolId: function(school_id){
		return new Promise(function (resolve, reject) {
			//console.log("findWithSchoolId");
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT id, name, menu FROM classes WHERE school = $1', [school_id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Executed correctly
					done();
				});
			});
		});
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
