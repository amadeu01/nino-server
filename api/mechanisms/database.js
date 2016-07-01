var db = {
	createTables: function(client) {
		return new Promise(function (resolve, reject) {
			client.query('CREATE TABLE IF NOT EXISTS accounts (id	SERIAL, email	VARCHAR, password	VARCHAR, hash	VARCHAR, CONSTRAINT must_be_unique UNIQUE(email))', function(err, result) {
				if (err) reject(err);
				else resolve(result);
			});
		});
	},
};

module.exports = db;
