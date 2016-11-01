var crypto = require('crypto');

var secure = {};

secure.slowCompare = function(a, b) {
	var diff = a.length ^ b.length;
	for (var i = 0; i < a.length && i < b.length; i++) {
		diff |= a[i] ^ b[i];
	}
	return (diff === 0);
};

secure.createSalt = function() {
	return crypto.randomBytes(32).toString();
};

secure.hash = function(password, salt) {
	return crypto.pbkdf2Sync(password, salt, 1000, 512, 'sha512').toString('hex');
};

module.exports = secure;
