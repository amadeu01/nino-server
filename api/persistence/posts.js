/**
* @module persistence/post
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
  * @description Creates a new Post with author_id Profile as author
  * @param post {Account} - Message, school, class, room, type
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
   * @param post {Account} - Message, school, class, room, type
   * @param author_id {profile_id}
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
				}).then(function(response) {
					response.profiles = [];
					return new Promise(function(res, rej) {
						var done = 0;
						var returned = false;
						if (profiles.length === 0) res(response); //Case empty
						else {
							for (var i in profiles) {
								//TODO: don't make functions on within loop !!!
								client.query('INSERT INTO posts_profiles (post, profile) VALUES ($1, $2) RETURNING profile', [response.post.id, profiles[i]], function(err, result) {
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
								});
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
	/** @method findPostsWithClassId
	 * @description something
	 * @param class_id {id}
	 */
	findPostsWithClassId: function(class_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT message, type, date, attachment FROM posts WHERE posts.class = $1', [class_id], function(err, result) {
					if (err) reject(err);
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Returns what was found
					done();
				});
			});
		});
	},
	/** @method findPostsWithProfileId
	 * @description something
	 * @param profile_id {id}
	 */
	findPostsWithProfileId: function(profile_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT p.message, p.type, p.date, p.attachment FROM posts p, posts_profiles pp WHERE p.id = pp.post AND pp.profile = $1', [profile_id], function(err, result) {
					if (err) reject(err);
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Returns what was found
					done();
				});
			});
		});
	},
	/** @method findPostsWithRoomId
	 * @description something
	 * @param room_id {id}
	 */
	findPostsWithRoomId: function(room_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT message, type, date, attachment FROM posts WHERE posts.room = $1', [room_id], function(err, result) {
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
