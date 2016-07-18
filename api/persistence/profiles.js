/** @module persistence/profiles */

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/**
* @class
*/
var profileServices = {
	findWithId: function(id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT name, surname, birthdate, gender FROM profiles WHERE id = $1', [id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows[0]); //Executed correctly
				});
			});
		});
	}
};

module.exports = profileServices;
