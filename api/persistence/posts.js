/**
* @module persistence/post
*/

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/**
* @class
*/
var postsDAO = {
 /** @method create
  * @description Creates a new Post with author_id Profile as author
  * @param post {Post} - Message, school, class, room, type
  *	@param author_id {profile_id}
  */
	create: function(post, author_id) {
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res, rej) {
						client.query('INSERT INTO posts (message, school, class, room, type, attachment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [post.message, post.school, post.class, post.room, post.type, post.attachment], function(err, result) {
							if (err) rej (err);
							else if (result.name == 'error') rej(result); //Some error occured : rejects
							else res(result.rows[0]);
						});
					});
				}).then(function(result) {
					return new Promise(function(res, rej) {
						var response = {};
						response.post = result;
						client.query('INSERT INTO posts_authors (post, author) VALUES ($1, $2)', [response.post.id, author_id], function(err, result) {
							if (err) rej (err);
							else if (result.name == 'error') rej(result); //Some error occured : rejects
							else {
								response.author = author_id;
								res(response);
							}
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
	},
	/** @method createWithProfiles
   * @description something
   * @param post {Post} - Message, school, class, room, type
   * @param author_id {profile_id}
	 * @param profiles {Array<profiles_id>}
   */
	createWithProfiles: function(post, author_id, profiles) {
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res, rej) {
						client.query('INSERT INTO posts (message, attachment, school, metadata, type) VALUES ($1, $2, $3, $4, $5) RETURNING id', [post.message, post.attachment, post.school, post.metadata, post.type], function(err, result) {
							if (err) rej (err);
							else if (result.name == 'error') rej(result); //Some error occured : rejects
							else res(result.rows[0]);
						});
					});
				}).then(function(result) {
					return new Promise(function(res, rej) {
						var response = {};
						response.post = result;
						client.query('INSERT INTO posts_authors (post, author) VALUES ($1, $2)', [response.post.id, author_id], function(err, result) {
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
								//TODO: don't make functions on within loop !!!
								client.query('INSERT INTO posts_profiles (post, profile) VALUES ($1, $2) RETURNING profile', [response.post.id, profiles[i]], insertDone);
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
	},
	/** @method markPostAsReadBy
   * @description something
   * @param profile_id {id}
   * @param post_id {id}
   */
	markPostAsReadBy: function(profile_id, post_id) {
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res, rej) {
						client.query('INSERT INTO posts_reads (post, profile) VALUES ($1, $2) RETURNING profile', [post_id, profile_id], function(err, result) {
							if (err) rej (err);
							else if (result.name == 'error') rej(result); //Some error occured : rejects
							else res(result.rows[0]);
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
	},
	/** @method getPostReadByInfo
   * @description something
   * @param post_id {id}
   */
	getPostReadByInfo: function(post_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT pr.profile, prf.name, prf.surname FROM posts_reads pr, posts p, profiles prf WHERE p.id = pr.post AND prf.id = pr.profile AND p.id = $1', [post_id], function(err, result) {
					if (err) reject(err);
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Returns what was found
					done();
				});
			});
		});
	},
	/** @method findPostWithId
	 * @description something
	 * @param post_id {id}
	 */
	findPostWithId: function(post_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT message, type, date, attachment FROM posts WHERE posts.id = $1', [post_id], function(err, result) {
					if (err) reject(err);
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows[0]); //Returns what was found
					done();
				});
			});
		});
	},
	
	findPostsWithProfileAndSchool : function(query) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT p.message, p.metadata, p.attachment, p.type, p.date FROM posts p, posts_profiles pp WHERE pp.profile = $1, pp.post = p.id, p.school = $2 ORDER BY p.date DESC LIMIT $3 OFFSET $4', [query.profile_id, query.school_id, query.limit, query.offset], function(err, result) {
					if (err) reject(err);
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows[0]); //Returns what was found
					done();
				});
			});
		});
	},
	
	findPostsWithProfileId: function(profile_id, limit, offset) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT p.message, p.metadata, p.type, p.date, p.attachment FROM posts p, posts_profiles pp WHERE p.id = pp.post AND pp.profile = $1 ORDER BY p.date DESC LIMIT $2 OFFSET $3', [profile_id, limit, offset], function(err, result) {
					if (err) reject(err);
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Returns what was found
					done();
				});
			});
		});
	},
	
	/** @method findPostsWithSchoolId
	 * @description something
	 * @param school_id {id}
	 */
	findPostsWithSchoolId: function(school_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT message, type, date, attachment FROM posts WHERE posts.school = $1', [school_id], function(err, result) {
					if (err) reject(err);
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Returns what was found
					done();
				});
			});
		});
	},
	/** @method findPostsWithAuthorId
	 * @description something
	 * @param author_id {id}
	 */
	findPostsWithAuthorId: function(author_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT p.message, p.type, p.date, p.attachment FROM posts p, posts_authors pa WHERE p.id = pa.post AND pa.author = $1', [author_id], function(err, result) {
					if (err) reject(err);
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Returns what was found
					done();
				});
			});
		});
	}
};

module.exports = postsDAO;
