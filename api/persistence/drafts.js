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
					client.query('INSERT INTO drafts (message, attachment, school, metadata, type) VALUES ($1, $2, $3, $4, $5) RETURNING id, createdAt', [draft.message, draft.attachment, draft.school, draft.metadata, draft.type], function(err, result) {
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
			client.query('SELECT d.id, d.message, d.metadata, d.attachment, d.type, d.createdAt, d.modified FROM drafts d, drafts_profiles dp WHERE dp.profile = $1 AND dp.draft = d.id AND d.school = $2 ORDER BY d.modified DESC LIMIT $3 OFFSET $4', [query.profile_id, query.school_id, query.limit, query.offset], function(err, result) {
				if (err) reject(err);
				else if (result.rowCount === 0) reject(result); //Nothing found, sends error
				else if (result.name == "error") reject(result); //Some error occured : rejects
				else resolve(result.rows); //Returns what was found
				done();
			});
		});
	});
};

drafts.updateDraft = function(draft_id, new_draft, school_id, author_id) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err); //Encaminha pro BO
				return;
			}
			transaction.start(client)
			.then(function() {
				return new Promise(function(res, rej) {
					client.query('UPDATE drafts SET (message, metadata, attachment) = (COALESCE($1, message), COALESCE($2, metadata), COALESCE($3, attachment)) WHERE id = $4 AND school = $5',[new_draft.message, new_draft.metadata, new_draft.attachment, draft_id, school_id], function(err, result) {
						if (err) rej(err);
						else if (result.rowCount === 0) rej(result); //Reject here - will stop transaction
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							res(result.rows[0]);
						} //Updated one row, user confirmed! - proceed
					});
				});
			}).then(function(result) {
				return new Promise(function(res, rej) {
					client.query('SELECT author FROM drafts_authors WHERE draft = $1 AND author = $2', [draft_id, author_id], function(err, result) {
						if (err) rej(err);
						else if (result.name == "error") rej(result);
						else res(result);
					});
				});
			}).then(function(result) {
				return new Promise(function(res, rej) {
					if (result.rowCount !== 0) res(result); //This author already exists
					else client.query('INSERT INTO drafts_authors (draft, author) VALUES ($1, $2)', [draft_id, author_id], function(err, result) {
						if (err) rej(err);
						else if (result.name == "error") rej(result);
						else res(result);
					});
				});
			}).then(function(result) {
				return transaction.commit(client)
				.then(function() {
					done();
					resolve(result); //Ended transaction and resolved to BO
				}).catch(function(err) {
					done(err);
					reject(err); //Error on transaction, reject to BO
				});
			}).catch(function(err) {
				return transaction.abort(client)
				.then(function() {
					done();
					reject(err); //Reject error to BO
				}).catch(function(err2) {
					done(err2);
					reject(err2); //Reject other error to BO
				});
			});
		});
	});	
};

drafts.postDraft = function(draft_id, school_id) {
	return new Promise(function (resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				reject(err); //Encaminha pro BO
				return;
			}
			transaction.start(client)
			.then(function() {
				return new Promise(function(res, rej) {
					client.query('SELECT d.school, d.message, d.attachment, d.metadata, d.type, (SELECT array_to_string(array_agg(profile), \',\') AS profiles FROM drafts_profiles dp WHERE dp.draft = d.id) AS profiles, (SELECT array_to_string(array_agg(author), \',\') AS authors FROM drafts_authors da WHERE da.draft = d.id) AS authors FROM drafts d WHERE d.id = $1 AND d.school = $2', [draft_id, school_id], function(err, result) {
						if (err) rej(err);
						else if (result.rowCount === 0) rej(result); //Reject here - will stop transaction
						else if (result.name == "error") rej(result); //Some error occured : rejects
						else {
							res(result.rows[0]);
						}
					});
				});
			}).then(function(draft) {
				return new Promise(function(res, rej) {
					client.query('INSERT INTO posts (message, attachment, school, metadata, type) VALUES ($1, $2, $3, $4, $5) RETURNING id, createdAt', [draft.message, draft.attachment, draft.school, draft.metadata, draft.type], function(err, result) {
						if (err) rej (err);
						else if (result.name == 'error') rej(result); //Some error occured : rejects
						else {
							var post = draft;
							post.id = result.rows[0].id;
							res(post);
						}
					});
				});
			}).then(function(post) {
				return new Promise(function(res, rej) {
					var done = 0;
					var returned = false;
					if (post.authors.length === 0) res(post); //Case empty
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
							else if (done == post.authors.length && !returned) res(post);
						};
						for (var i in post.authors) {
							//TODO: don't make functions on within loop !!!
							client.query('INSERT INTO posts_authors (post, author) VALUES ($1, $2)', [post.id, post.authors[i]], insertDone);
							if (returned) break;
						}
					}
				});
			}).then(function(post) { 
				return new Promise(function(res, rej) {
					var done = 0;
					var returned = false;
					if (post.profiles.length === 0) res(post); //Case empty
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
							else if (done == post.profiles.length && !returned) res(post);
						};
						for (var i in post.profiles) {
							//TODO: don't make functions on within loop !!!
							client.query('INSERT INTO posts_profiles (post, profile) VALUES ($1, $2) RETURNING profile', [post.id, post.profiles[i]], insertDone);
							if (returned) break;
						}
					}
				});
			}).then(function(post) {
				return new Promise(function(res, rej) {
					client.query('DELETE FROM drafts WHERE id = $1 AND school = $2', [draft_id, school_id], function(err, result) {
						if (err) rej (err);
						else if (result.name == 'error') rej(result); //Some error occured : rejects
						else {
							res(post);
						}
					});
				});
			}).then(function(result) {
				return transaction.commit(client)
				.then(function() {
					done();
					resolve({post: result}); //Ended transaction and resolved to BO
				}).catch(function(err) {
					done(err);
					reject(err); //Error on transaction, reject to BO
				});
			}).catch(function(err) {
				return transaction.abort(client)
				.then(function() {
					done();
					reject(err); //Reject error to BO
				}).catch(function(err2) {
					done(err2);
					reject(err2); //Reject other error to BO
				});
			});
		});
	});	
}

module.exports = drafts;
