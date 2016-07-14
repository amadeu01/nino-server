/**
* @author Amadeu Cavalcante
* @module mechanisms
*/

var aws = require('aws-sdk');
var s3 = new aws.S3();

var awsMec = {};

var profilePicBucket = 'ninoapp-profiles-files-01';

awsMec.uploadProfilePic = function(file, name) {
	awsMec.upload(file, name, profilePicBucket);
}

awsMec.upload = function(file, name, bucket) {
	return new Promise(function(resolve, reject) {
		var params = {
		  Bucket: bucket, /* required */
		  Key: name, /* required */
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
