/**
* @author Amadeu Cavalcante
* @module mechanisms
*/

var aws = require('aws-sdk');
var s3 = new aws.S3();

var awsMec = {};

var profilePicBucket = 'ninoapp-profiles-files-01';

awsMec.uploadProfilePic = function(file, name, size) {
	return awsMec.upload(file, name, profilePicBucket, size);
}

awsMec.upload = function(file, name, bucket, size) {
	return new Promise(function(resolve, reject) {
		var params = {
			Bucket: bucket, /* required */
			Key: name, /* required */
			ACL: 'private',
			Body: file,
			ContentLength: size
		};
		s3.putObject(params, function(err, data) {
			if (err) reject(err);
			else     resolve(data);
		});
	});
}

module.exports = awsMec;
