const crypto = require('crypto');

var secure = {}

secure.slowCompare = function(a, b) {
	var diff = a.length ^ b.length;
	for (var i = 0; i < a.length && i < b.length; i++) {
		diff |= a[i] ^ b[i];
	}
	return (diff == 0);
}

secure.createSalt = function() {
	return crypto.randomBytes(32).toString();
}

secure.hash = function(password, salt) {
	return crypto.pbkdf2Sync(password, salt, 1000, 512, 'sha512')
}

var a = secure.createSalt();
var b = secure.hash("bacon",a);
var c = secure.hash("vegan",a);


console.log(secure.slowCompare(c,c));
console.log(secure.slowCompare(b,b));
console.log(secure.slowCompare(b,c));

module.exports = secure;