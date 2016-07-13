/**
* @author Amadeu Cavalcante
* @module mechanisms
*/

var aws = require('aws-sdk');
var s3 = new aws.S3();

var awsMec = {}

awsMec.uploadProfile = function(file) {
	return new Promise(function(resolve, reject) {
		var params = {
		  Bucket: 'ninoapp-profiles-files-01', /* required */
		  Key: 'mynewfile.txt', /* required */
		  ACL: 'private',
		  Body: file
		};
		s3.putObject(params, function(err, data) {
		  if (err) reject(err);
		  else     resolve(data);
		});
	});
}

module.exports = awsMec;
