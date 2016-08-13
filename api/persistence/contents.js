/** @module persistence/accounts */

var contentsDAO = {};
var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;



contentsDAO.createContent = function(profile, school, key, upload) {
	return new Promise(function(resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			transaction.start(client)
			.then(function() {
				return new Promise(function(res, rej) {
					client.query('INSERT INTO contents (profile, school, key) VALUES ($1, $2, $3) RETURNING id', [profile, school, key], function(err, result) {
						if (err) rej (err);
						else if (result.name == 'error') rej(result); //Some error occured : rejects
						else res(result);
					});
				});
			}).then(function(result) {
				return new Promise(function(res, rej) {
					upload()
					.then(function(up_result) {
						res({s3: up_result, content: result});
					}).catch(function(up_fail) {
						rej(up_fail);
					});
				})
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

contentsDAO.deleteContentWithKey = function(key, deleteOnS3) {
	return new Promise(function(resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			transaction.start(client)
			.then(function() {
				return new Promise(function(res, rej) {
					client.query('DELETE FROM contents WHERE key = $1', [key], function(err, result) {
						if (err) rej (err);
						else if (result.name == 'error') rej(result); //Some error occured : rejects
						else res(result);
					});
				});
			}).then(function(result) {
				return new Promise(function(res, rej) {
					deleteOnS3()
					.then(function(up_result) {
						res({s3: up_result, content: result});
					}).catch(function(up_fail) {
						rej(up_fail);
					});
				})
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

contentsDAO.getContentWithKey = function(key) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err); //Connection error, aborts already
				return;
			}
			client.query('SELECT profile, school, access FROM contents WHERE key = $1', [key], function(err, result) {
				if (err) reject(err); //Error: rejects to BO
				else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				else if (result.name == "error") reject(result); //Some error occured : rejects
				else resolve(result.rows); //Executed correctly
				done();
			});
		});
	});
}

module.exports = contentsDAO;
