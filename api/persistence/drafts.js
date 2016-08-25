/**
* @author Carlos Millani
* @module persistence
*/

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

var drafts = {};

drafts.createWithProfiles = function(draft, author_id ,profiles) {
	return new Promise(function(resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			transaction.start(client)
			.then(function() {
				return new Promise(function(res, rej) {
					client.query('INSERT INTO drafts (message, attachment, school, metadata, type) VALUES ($1, $2, $3, $4, $5) RETURNING id', [draft.message, draft.attachment, draft.school, draft.metadata, draft.type], function(err, result) {
						if (err) rej (err);
						else if (result.name == 'error') rej(result); //Some error occured : rejects
						else res(result.rows[0]);
					});
				});
			}).then(function(result) {
				return new Promise(function(res, rej) {
					var response = {};
					response.draft = result;
					client.query('INSERT INTO drafts_authors (draft, author) VALUES ($1, $2)', [response.draft.id, author_id], function(err, result) {
						if (err) rej (err);
						else if (result.name == 'error') rej(result); //Some error occured : rejects
						else {
							response.author = author_id;
							res(response);
						}
					});
				});
			}).then(function(response) {
				response.profiles = [];
				return new Promise(function(res, rej) {
					var done = 0;
					var returned = false;
					if (profiles.length === 0) res(response); //Case empty
					else {
						var insertDone = function(err, result) {
							done++;
							if (err) {
								rej (err);
								returned = true;
							}
							else if (result.name == 'error') {
								rej(result); //Some error occured : rejects
								returned = true;
							}
							else {
								response.profiles.push(result.rows[0].profile);
								if (done == profiles.length && !returned) res(response);
							}
						};
						for (var i in profiles) {
							client.query('INSERT INTO drafts_profiles (draft, profile) VALUES ($1, $2) RETURNING profile', [response.draft.id, profiles[i]], insertDone);
							if (returned) break;
						}
					}
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
};

drafts.findWithProfileAndSchool = function(query) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err);
				return;
			}
			client.query('SELECT d.message, d.metadata, d.attachment, d.type, d.date FROM drafts d, drafts_profiles dp WHERE dp.profile = $1, dp.draft = d.id, d.school = $2 ORDER BY d.date DESC LIMIT $3 OFFSET $4', [query.profile_id, query.school_id, query.limit, query.offset], function(err, result) {
				if (err) reject(err);
				else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				else if (result.name == "error") reject(result); //Some error occured : rejects
				else resolve(result.rows[0]); //Returns what was found
				done();
			});
		});
	});
}

module.exports = drafts;
